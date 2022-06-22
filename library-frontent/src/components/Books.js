import { useQuery } from "@apollo/client";
import { ALL_BOOKS, FIND_BOOK } from "../queries";
import { useState } from "react";

const Book = ({ book, onClose }) => {
  return (
    <div>
      <h3>Title: {book.title}</h3>
      <div>Published: {book.published}</div>
      Genres:{" "}
      {book.genres.map((g, index) => (
        <div key={index}>{g}</div>
      ))}
      <button onClick={onClose}>close</button>
    </div>
  );
};

const Books = (props) => {
  const [genreForFilter, setGenreForFilter] = useState(null);
  const result = useQuery(ALL_BOOKS);

  const handleClick = (value) => {
    setGenreForFilter(value);
  };

  const resultTwo = useQuery(FIND_BOOK, {
    variables: { genreToSearch: genreForFilter },
    skip: !genreForFilter,
  });

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const allBooks = result.data.allBooks;
  const arrayOfArraysofGenres = allBooks.map((book) =>
    book.genres.map((g) => g)
  );
  const arrayOfGenres = [].concat.apply([], arrayOfArraysofGenres);
  const arrayWithoutDuplicates = [...new Set(arrayOfGenres)];

  if (genreForFilter && resultTwo.data) {
    return (
      <Book
        book={resultTwo.data.findBook[0]}
        onClose={() => setGenreForFilter(null)}
      />
    );
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {arrayWithoutDuplicates.map((value, index) => (
        <button key={index} onClick={() => handleClick(value)}>
          {value}
        </button>
      ))}
    </div>
  );
};

export default Books;
