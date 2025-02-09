import React, { useState } from "react";
import './TablaVerLista.scss'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from "@tanstack/react-table";

const FiltroColumna = ({ column }) => {
    const columnFilterValue = column.getFilterValue() || "";
    return (
        <input
            className="filtro-input"
            type="text"
            value={columnFilterValue}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder={`Filtrar ${column.columnDef.header}`}
            style={{ width: "100%", padding: "5px", fontSize: "14px" }}
        />
    );
};

const TablaVerLista = ({ columns, data }) => {

    const [sorting, setSorting] = useState([]); // Estado para ordenamiento

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
    });

    return (
        <div className="tabla-container">
            <table border="1" className="tabla">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="header-columna">
                                    <button
                                        className="btn-ordenar"
                                        onClick={header.column.getToggleSortingHandler()}
                                        style={{ background: "none", border: "none", cursor: "pointer" }}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() === "asc" ? " ⭡" : header.column.getIsSorted() === "desc" ? " ⭣" : header.column.getCanSort() ? " ⭥" : ""}
                                    </button>
                                </th>
                            ))}
                        </tr>
                    ))}
                    {/* Fila de filtros */}
                    <tr className="fila-filtros">
                        {table.getHeaderGroups().map((headerGroup) =>
                            headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.column.getCanFilter() ? <FiltroColumna column={header.column} /> : null}
                                </th>
                            ))
                        )}
                    </tr>
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="fila">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="celda">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TablaVerLista;
