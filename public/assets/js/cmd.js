const module_options = {};

function cmd() {
    module_options.path = "/public/assets/js/";
    module_options.modules = new Set();
}

function require(fileName) {
    const path = require.resolve(fileName);
    if (module_options.modules.has(path)) {
        return;
    }
    module_options.modules.add(path);

    const xhr = new XMLHttpRequest();
    xhr.open("get", path, false);
    xhr.send();
    if (xhr.readyState === 4 && xhr.status === 200) {
        const def = `
            function define(require, exports, module) {
                ${xhr.responseText}
            }
        `;

        eval(def);

        const module = {
            exports: {}
        };
        define(require, module.exports, module);
    }
}

require.resolve = function(fileName) {
    if (fileName.startsWith("./")) {
        fileName = fileName.slice(2);
    }

    if (!fileName.endsWith(".js")) {
        return module_options.path + fileName + ".js";
    }
    else {
        return module_options.path + fileName;
    }
}
