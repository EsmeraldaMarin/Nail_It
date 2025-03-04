function EstilistaCard({ estilista, onClick }) {
    return (
        <button className="card" onClick={() => onClick(estilista)}>
            <h4 className="border-bottom border-dark-subtle pb-2" style={{ width: "100%" }}> {estilista.nombre} {estilista.apellido}</h4>
            <p className="d-flex flex-column justify-content-start" style={{ width: "100%" }}>
                <span className="text-start">Email </span>
                <input className="form-control" type="text" value={estilista.email} aria-label="readonly input example" readOnly />
            </p>
            <p className="d-flex flex-column justify-content-start" style={{ width: "100%" }}>
                <span className="border-top text-start">Teléfono </span>
                <input className="form-control" type="text" value={estilista.numero} aria-label="readonly input example" readOnly/>
            </p>
        </button>
    );
}
export default EstilistaCard;
