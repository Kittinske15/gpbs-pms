import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";

const Log = () => {
    const originalRows = [
        {
            id: '1', type: 'Wait for approve', date: 'Thu 02 Feb 2023 17:10:14', by: 'Ongard Prapakamol'
        },
        {
            id: '2', type: 'Update', date: 'Thu 02 Feb 2023 17:11:42', by: 'Ongard Prapakamol'
        },
        {
            id: '3', type: 'Update', date: 'Mon 20 Feb 2023 00:28:03', by: 'Ongard Prapakamol'
        },
        {
            id: '4', type: 'Update', date: 'Fri 10 Mar 2023 10:31:09', by: 'Ongard Prapakamol'
        },
        {
            id: '5', type: 'Update Project Action plan', date: 'Mon 03 Apr 2023 00:26:35', by: 'Ongard Prapakamol'
        },
        {
            id: '6', type: 'Update', date: 'Mon 03 Apr 2023 09:10:14', by: 'Ongard Prapakamol'
        },

    ];

    const [rows, setRows] = useState(originalRows);

    return (
        <>
            <Paper>
                <TableContainer>
                    <Table className="project-table" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell align="center">Action Type</TableCell>
                                <TableCell align="center">Action Date</TableCell>
                                <TableCell align="center">Action By</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell align="center">{row.type}</TableCell>
                                    <TableCell align="center">{row.date}</TableCell>
                                    <TableCell align="center">{row.by}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
};

export default Log;
