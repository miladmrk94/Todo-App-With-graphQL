import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";


const getData = gql`
 query GetTodo {
    todos {
        id
        type
    }
}
`
const postData = gql`
mutation UpdateTodo($id: String!, $type: String!) {
    updateTodo(id: $id, type: $type) {
      id
      type
    }
  }
`;


const TodoApp = () => {

    const { data, loading, error, refetch } = useQuery(getData,)
    const [mutatedTodo, { data: mutatedData, loading: mutatedLoading, error: mutatedError }] = useMutation(postData, {
        refetchQueries: [
            { query: getData }, // DocumentNode object parsed with gql
            'GetTodo' // Query name
        ],
    })
    const [inputValue, setInputValue] = useState("")
    const [showEditor, setShowEditor] = useState(false)
    const [edit, setEdit] = useState('')

    return (
        <div>
            <div>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    console.log(inputValue);
                    mutatedTodo({ variables: { id: Math.floor(Math.random() * (900 - 100 + 1) + 100).toString(), type: inputValue } })
                    setInputValue("")
                }}>
                    <button type="submit" style={{ margin: "10px 10px 10px 0px" }} >send todo</button>

                    <input onChange={(e) => {
                        if (e.target.value.length > 0) {
                            setInputValue(e.target.value)
                        } else {
                            return
                        }
                    }}
                        value={inputValue}
                        style={{ padding: "10px" }}
                    />
                </form>
            </div>
            <hr />
            {loading ?
                <span>loading...</span>
                :
                error ?
                    <span>error: {error.message}</span>
                    :
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {data.todos.map((i) => {
                            return (
                                <form key={i.id} onSubmit={(e) => {
                                    e.preventDefault()
                                    mutatedTodo({ variables: { id: i.id, type: edit } })
                                    setEdit("")
                                    setShowEditor(!showEditor)
                                }}>
                                    <span >{i.type}</span>
                                    <span onClick={() => { setShowEditor(!showEditor) }}> =E=</span>
                                    {showEditor &&
                                        <>
                                            <input onChange={(e) => {
                                                if (e.target.value.length > 0) {
                                                    setEdit(e.target.value)
                                                } else {
                                                    return
                                                }
                                            }} />
                                            <button type="submit">OK</button>
                                        </>


                                    }
                                </form>
                            )
                        })}
                    </div>
            }

        </div>
    );
}

export default TodoApp;