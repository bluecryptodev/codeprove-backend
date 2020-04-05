const router = require('express').Router();
const local_path = process.env.LOCAL_PATH;

router.route('/audio_file_get/:filename').get((req, res)=> {
    res.sendFile(local_path+'audio/'+req.params.filename);
});

module.exports = router;