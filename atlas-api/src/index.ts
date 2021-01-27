import './pre-start'; // Must be the first import
import app from '@server';
import config from "config";
import {logger} from '@shared/logger';


// Start the server
const port = Number(process.env.PORT || config.get("atlas.port"));
const hostname = String(config.get("atlas.hotsname") || "localhost");

app.listen(port, hostname, () => {
    logger.info('Express server started on port: ' + port);
});
