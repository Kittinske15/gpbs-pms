import React from 'react';
import MaterialReactTable from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import { mockData } from './data';
import { MOCKUPDATA } from '../constants/column';

const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: MOCKUPDATA.map((c) => c.Header),
};

const csvExporter = new ExportToCsv(csvOptions);

export const CentralWarroomTable = () => {
    const handleExportRows = (rows) => {
        csvExporter.generateCsv(rows.map((row) => row.original));
    };

    const handleExportData = () => {
        csvExporter.generateCsv(mockData);
    };

    return (
        <MaterialReactTable
            columns={MOCKUPDATA}
            data={mockData}
            positionToolbarAlertBanner="bottom"
            renderTopToolbarCustomActions={({ table }) => (
                <Box
                    sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                >
                    <Button
                        color="primary"
                        //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                        onClick={handleExportData}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                    >
                        Export All Data
                    </Button>
                </Box>
            )}
        />
    );
};