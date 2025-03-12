SELECT p.*, c.* FROM projects p
INNER JOIN users u on p.userId = u.id