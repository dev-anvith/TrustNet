const clientModel = require('../models/client-model');

module.exports = async function getScript(user_id) {
    try {
        const user = await clientModel.findById(user_id);

        if (user && user.script) {
            return user.script;
        } else {
            return "Script not yet generated, please go to script configuration to generate a script.";
        }
    } catch (err) {
        console.error("Error fetching script:", err);
        return "Error retrieving script.";
    }
};
