export default function CreateBox({ handleCreate }){ 

    return(
        <form onSubmit={handleCreate}>
            <label>Coloque seu JSON aqui:</label>
            <textarea
                rows="50"
                cols="220"
            ></textarea>
            <button>Enviar</button>
        </form>
    )
}