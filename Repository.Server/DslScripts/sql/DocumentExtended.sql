 WITH LatestContent AS (
    SELECT 
        dtc.DocumentID,
        MAX(dtc.CreatedDate) AS MaxCreatedDate
    FROM 
        DocumentProcessing.DocumentContent dtc
    GROUP BY 
        dtc.DocumentID
)
SELECT 
    d.ID,
	cci.Value AS SkolskaGodina,
	CONVERT(VARCHAR(10), d.CreatedDate, 104) + '.' AS CreatedDateString,
    dc.FileExtension,
    dc.ID AS DocumentContentID
FROM DocumentProcessing.Document d
LEFT JOIN LatestContent lc ON d.ID = lc.DocumentID
LEFT JOIN DocumentProcessing.DocumentContent dc ON dc.DocumentID = lc.DocumentID AND dc.CreatedDate = lc.MaxCreatedDate
LEFT JOIN DocumentProcessing.ContentControlInfo cci ON cci.DocumentID = d.ID AND cci.Tag = 'SkolskaGodina'