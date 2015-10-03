select a.barcode, a.title, a.classification, a.description, a.subject from items a
where not (a.description in ('CD', 'DVD') and a.itemnotes like 'Or%nal%')
and not exists (select 1 from issue_history b where a.barcode = b.barcode)
and not exists (select 1 from `out` c where a.barcode = c.barcode)

