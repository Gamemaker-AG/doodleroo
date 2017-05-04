import ButtonSystem from "systems/Button" 
import * as actions from "button-actions";

export default {
    name: 'button',
    defaults: { action: actions.ALERT }
};

