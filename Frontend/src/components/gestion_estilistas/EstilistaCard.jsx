function EstilistaCard({ estilista, onClick }) {
    return (
        <button className="card" onClick={() => onClick(estilista)}>
            <h2>{estilista.nombre} {estilista.apellido}</h2>
            <p>{estilista.email}</p>
            <p>{estilista.numero}</p>
        </button>
    );
}
export default EstilistaCard;
