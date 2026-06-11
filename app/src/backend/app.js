
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'vista', 'index.html'));
});

app.use((req, res) => {
	res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ error: 'Internal Server Error' });
});

if (require.main === module) {
	app.listen(3000, () => {
		console.log(`Server listening on port 3000`);
	});
}

module.exports = app;
