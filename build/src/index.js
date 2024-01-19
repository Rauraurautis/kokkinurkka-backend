"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./utils/logger"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const connect_1 = __importDefault(require("./utils/connect"));
const deserializeUser_1 = require("./middleware/deserializeUser");
const errorHandler_1 = require("./middleware/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ exposedHeaders: ["x-access-token", "CSRF-Token"], origin: "http://localhost:3000", methods: ["POST", "PUT", "DELETE"], credentials: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../client/build')));
app.use(express_1.default.json());
app.use(deserializeUser_1.deserializeUser);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connect_1.default)();
    console.log(path_1.default.join(__dirname, '../client/build'));
    logger_1.default.info(`Listening to port ${PORT}`);
    (0, routes_1.default)(app);
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../client/build', 'index.html'));
    });
    app.use(errorHandler_1.errorHandler);
}));
