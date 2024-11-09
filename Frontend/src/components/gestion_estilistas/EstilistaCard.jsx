function EstilistaCard({ estilista, onClick }) {
    return (
        <button className="card" onClick={() => onClick(estilista)}>
            <h2>{estilista.nombre} {estilista.apellido}</h2>
            <p>{estilista.email}</p>
            <p>{estilista.numero}</p>
<<<<<<< HEAD
            {/* <p>Horarios: { }</p> */}
=======
            <p>Horarios: { }</p>
>>>>>>> ecba6c62ded3697c51d1ad22b4f35c711d1fe836
        </button>
    );
}
export default EstilistaCard;
