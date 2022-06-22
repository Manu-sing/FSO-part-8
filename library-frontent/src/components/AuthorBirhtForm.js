import { useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const AuthorBirhtForm = () => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const authorInfo = useQuery(ALL_AUTHORS);

  const [editAuthor, result] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const submit = (e) => {
    e.preventDefault();

    editAuthor({ variables: { name, setBornTo: born } });

    setName("");
    setBorn("");
  };

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.log("person not found");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data]);

  if (authorInfo.loading) {
    return <div>loading...</div>;
  }

  const authors = authorInfo.data.allAuthors;

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          {/* name{" "}
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          /> */}
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          year of birth{" "}
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">change</button>
      </form>
    </div>
  );
};

export default AuthorBirhtForm;
