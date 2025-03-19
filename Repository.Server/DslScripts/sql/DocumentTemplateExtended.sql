 WITH LatestTemplateContent AS (
    SELECT 
        dtc.DocumentTemplateID,
        MAX(dtc.CreatedDate) AS MaxCreatedDate
    FROM 
        DocumentProcessing.DocumentTemplateContent dtc
    GROUP BY 
        dtc.DocumentTemplateID
)
SELECT 
    dt.ID,
    dtc.ID AS DocumentTemplateContentID,
    dtc.FileExtension,
	CONVERT(VARCHAR(10), dt.CreatedDate, 104) + '.' AS CreatedDateString
FROM DocumentProcessing.DocumentTemplate dt
LEFT JOIN LatestTemplateContent ltc ON dt.ID = ltc.DocumentTemplateID
LEFT JOIN DocumentProcessing.DocumentTemplateContent dtc ON dtc.DocumentTemplateID = ltc.DocumentTemplateID AND dtc.CreatedDate = ltc.MaxCreatedDate