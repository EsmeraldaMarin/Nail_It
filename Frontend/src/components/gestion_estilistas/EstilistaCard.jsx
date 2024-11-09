function EstilistaCard({ estilista, onClick }) {
    return (
        <button className="card" onClick={() => onClick(estilista)}>
            <h2>{estilista.nombre} {estilista.apellido}</h2>
            <p>{estilista.email}</p>
            <p>{estilista.numero}</p>
            {/* <p>Horarios: { }</p> */}
<<<<<<< HEAD
            <p>Horarios: { }</p>
=======
>>>>>>> f9d4aa594f0000fe48ecbf44a1df1fdd89f03b53
        </button>
    );
}
export default EstilistaCard;
