function SearchBar({ searchTerm, onSearch }) {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Buscar por nombre, apellido o email"
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value.toLowerCase())}
                className="search-input"
            />
        </div>
    );
}
export default SearchBar;
