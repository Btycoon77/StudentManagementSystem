"use strict";
function importExcelData2(req, res) {
    var _a;
    try {
        // Check if a file is uploaded
        const uploadedFile = (_a = req.files) === null || _a === void 0 ? void 0 : _a.fileName;
        if (!uploadedFile) {
            return res.status(400).json({
                error: 'No file uploaded',
            });
        }
        // Parse the Excel file
        const workbook = xlsx.read(uploadedFile.data, { type: 'buffer' });
        const data = [];
        const sheetNames = workbook.SheetNames;
        // Process each sheet
        for (let i = 0; i < sheetNames.length; i++) {
            const arr = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[i]]);
            arr.forEach((row) => {
                data.push(row);
            });
        }
        //  transform the data in a specific format
        let result = transformData(data);
        console.log(result);
        // Send response with processed data
        res.status(200).json({
            result: 'Data successfully processed',
            data: result,
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}
//# sourceMappingURL=transaltion.js.map