"use strict";
// Local Storage Service for Auth and Data
// This replaces Firebase for a "No-Setup" experience
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockDb = exports.mockAuth = void 0;
var STORAGE_KEYS = {
    USERS: 'buildcheck_users',
    CURRENT_USER: 'buildcheck_current_user',
    INSPECTIONS: 'buildcheck_inspections',
    REGULATIONS: 'buildcheck_regulations',
    REPORTS: 'buildcheck_reports'
};
// Helper to get data from localStorage
var get = function (key) { return JSON.parse(localStorage.getItem(key) || '[]'); };
var set = function (key, data) { return localStorage.setItem(key, JSON.stringify(data)); };
exports.mockAuth = {
    currentUser: JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null'),
    signIn: function (email, pass) { return __awaiter(void 0, void 0, void 0, function () {
        var users, user, sessionUser;
        return __generator(this, function (_a) {
            users = get(STORAGE_KEYS.USERS);
            user = users.find(function (u) { return u.email === email && u.password === pass; });
            if (!user)
                throw new Error('Invalid email or password');
            sessionUser = { uid: user.uid, email: user.email, displayName: user.displayName };
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
            return [2 /*return*/, sessionUser];
        });
    }); },
    signUp: function (email, pass, name) { return __awaiter(void 0, void 0, void 0, function () {
        var users, newUser, sessionUser;
        return __generator(this, function (_a) {
            users = get(STORAGE_KEYS.USERS);
            if (users.find(function (u) { return u.email === email; }))
                throw new Error('Email already exists');
            newUser = { uid: Math.random().toString(36).substr(2, 9), email: email, password: pass, displayName: name };
            users.push(newUser);
            set(STORAGE_KEYS.USERS, users);
            sessionUser = { uid: newUser.uid, email: newUser.email, displayName: newUser.displayName };
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
            return [2 /*return*/, sessionUser];
        });
    }); },
    signOut: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
            return [2 /*return*/];
        });
    }); },
    onAuthStateChanged: function (callback) {
        var user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
        callback(user);
        return function () { }; // Unsubscribe mock
    }
};
exports.mockDb = {
    getInspections: function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, initial;
        return __generator(this, function (_a) {
            data = get(STORAGE_KEYS.INSPECTIONS);
            if (data.length === 0) {
                initial = [
                    {
                        id: 'ins-7721',
                        title: 'Sandton City Fire Safety',
                        type: 'fire-safety',
                        location: 'Sandton, Johannesburg',
                        date: new Date().toISOString(),
                        status: 'in-progress',
                        complianceScore: 75
                    },
                    {
                        id: 'ins-8832',
                        title: 'Cape Town Port Structural',
                        type: 'structural',
                        location: 'Table Bay, Cape Town',
                        date: new Date(Date.now() - 86400000).toISOString(),
                        status: 'completed',
                        complianceScore: 92
                    },
                    {
                        id: 'ins-9943',
                        title: 'Durban North Electrical Grid',
                        type: 'electrical',
                        location: 'Umhlanga, Durban',
                        date: new Date(Date.now() - 172800000).toISOString(),
                        status: 'critical',
                        complianceScore: 45
                    }
                ];
                set(STORAGE_KEYS.INSPECTIONS, initial);
                return [2 /*return*/, initial];
            }
            return [2 /*return*/, data];
        });
    }); },
    saveInspection: function (inspection) { return __awaiter(void 0, void 0, void 0, function () {
        var inspections, index;
        return __generator(this, function (_a) {
            inspections = get(STORAGE_KEYS.INSPECTIONS);
            index = inspections.findIndex(function (i) { return i.id === inspection.id; });
            if (index > -1) {
                inspections[index] = inspection;
            }
            else {
                inspections.push(__assign(__assign({}, inspection), { id: inspection.id || "ins-".concat(Math.random().toString(36).substr(2, 4)) }));
            }
            set(STORAGE_KEYS.INSPECTIONS, inspections);
            return [2 /*return*/, inspection];
        });
    }); },
    getRegulations: function () { return __awaiter(void 0, void 0, void 0, function () {
        var regs, initialRegs;
        return __generator(this, function (_a) {
            regs = get(STORAGE_KEYS.REGULATIONS);
            if (regs.length === 0) {
                initialRegs = [
                    { id: '1', category: 'Fire Safety', ruleText: 'All fire doors must be self-closing and self-latching. Clearances must not exceed 10mm.', severity: 'critical', code: 'SANS 10400-T' },
                    { id: '2', category: 'Structural', ruleText: 'Foundations must be inspected for settlement cracks exceeding 2mm in width.', severity: 'high', code: 'SANS 10400-H' },
                    { id: '3', category: 'Electrical', ruleText: 'Distribution boards must be clearly labeled and accessible at all times.', severity: 'medium', code: 'SANS 10142-1' }
                ];
                set(STORAGE_KEYS.REGULATIONS, initialRegs);
                return [2 /*return*/, initialRegs];
            }
            return [2 /*return*/, regs];
        });
    }); },
    getReports: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, get(STORAGE_KEYS.REPORTS)];
        });
    }); },
    saveReport: function (report) { return __awaiter(void 0, void 0, void 0, function () {
        var reports, newReport;
        return __generator(this, function (_a) {
            reports = get(STORAGE_KEYS.REPORTS);
            newReport = __assign(__assign({}, report), { id: "rep-".concat(Math.random().toString(36).substr(2, 4)), createdAt: new Date().toISOString() });
            reports.unshift(newReport);
            set(STORAGE_KEYS.REPORTS, reports);
            return [2 /*return*/, newReport];
        });
    }); },
    deleteReport: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var reports, filtered;
        return __generator(this, function (_a) {
            reports = get(STORAGE_KEYS.REPORTS);
            filtered = reports.filter(function (r) { return r.id !== id; });
            set(STORAGE_KEYS.REPORTS, filtered);
            return [2 /*return*/];
        });
    }); }
};
