"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/admin/check/route";
exports.ids = ["app/api/admin/check/route"];
exports.modules = {

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fcheck%2Froute&page=%2Fapi%2Fadmin%2Fcheck%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fcheck%2Froute.ts&appDir=C%3A%5CUsers%5Chamza%5CDesktop%5CDOF%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Chamza%5CDesktop%5CDOF&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fcheck%2Froute&page=%2Fapi%2Fadmin%2Fcheck%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fcheck%2Froute.ts&appDir=C%3A%5CUsers%5Chamza%5CDesktop%5CDOF%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Chamza%5CDesktop%5CDOF&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_hamza_Desktop_DOF_src_app_api_admin_check_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/admin/check/route.ts */ \"(rsc)/./src/app/api/admin/check/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/admin/check/route\",\n        pathname: \"/api/admin/check\",\n        filename: \"route\",\n        bundlePath: \"app/api/admin/check/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\hamza\\\\Desktop\\\\DOF\\\\src\\\\app\\\\api\\\\admin\\\\check\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_hamza_Desktop_DOF_src_app_api_admin_check_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/admin/check/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhZG1pbiUyRmNoZWNrJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhZG1pbiUyRmNoZWNrJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYWRtaW4lMkZjaGVjayUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNoYW16YSU1Q0Rlc2t0b3AlNUNET0YlNUNzcmMlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q2hhbXphJTVDRGVza3RvcCU1Q0RPRiZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDcUI7QUFDbEc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kZWZlbmRlcnMtb2YtZnV0dXJlLz80NzkyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXGhhbXphXFxcXERlc2t0b3BcXFxcRE9GXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXGFkbWluXFxcXGNoZWNrXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hZG1pbi9jaGVjay9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2FkbWluL2NoZWNrXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hZG1pbi9jaGVjay9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXGhhbXphXFxcXERlc2t0b3BcXFxcRE9GXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXGFkbWluXFxcXGNoZWNrXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hZG1pbi9jaGVjay9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fcheck%2Froute&page=%2Fapi%2Fadmin%2Fcheck%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fcheck%2Froute.ts&appDir=C%3A%5CUsers%5Chamza%5CDesktop%5CDOF%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Chamza%5CDesktop%5CDOF&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/admin/check/route.ts":
/*!******************************************!*\
  !*** ./src/app/api/admin/check/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var _lib_adminConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/adminConfig */ \"(rsc)/./src/lib/adminConfig.ts\");\n\n\n\nasync function GET() {\n    const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)();\n    const token = cookieStore.get(_lib_adminConfig__WEBPACK_IMPORTED_MODULE_2__.ADMIN_COOKIE_NAME)?.value;\n    if ((0,_lib_adminConfig__WEBPACK_IMPORTED_MODULE_2__.isValidAdminToken)(token)) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            authenticated: true\n        });\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        authenticated: false\n    }, {\n        status: 401\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hZG1pbi9jaGVjay9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTJDO0FBQ0o7QUFDa0M7QUFFbEUsZUFBZUk7SUFDcEIsTUFBTUMsY0FBY0oscURBQU9BO0lBQzNCLE1BQU1LLFFBQVFELFlBQVlFLEdBQUcsQ0FBQ0osK0RBQWlCQSxHQUFHSztJQUVsRCxJQUFJTixtRUFBaUJBLENBQUNJLFFBQVE7UUFDNUIsT0FBT04scURBQVlBLENBQUNTLElBQUksQ0FBQztZQUFFQyxlQUFlO1FBQUs7SUFDakQ7SUFFQSxPQUFPVixxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO1FBQUVDLGVBQWU7SUFBTSxHQUFHO1FBQUVDLFFBQVE7SUFBSTtBQUNuRSIsInNvdXJjZXMiOlsid2VicGFjazovL2RlZmVuZGVycy1vZi1mdXR1cmUvLi9zcmMvYXBwL2FwaS9hZG1pbi9jaGVjay9yb3V0ZS50cz84YmRmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcbmltcG9ydCB7IGNvb2tpZXMgfSBmcm9tICduZXh0L2hlYWRlcnMnO1xuaW1wb3J0IHsgaXNWYWxpZEFkbWluVG9rZW4sIEFETUlOX0NPT0tJRV9OQU1FIH0gZnJvbSAnQC9saWIvYWRtaW5Db25maWcnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKCkge1xuICBjb25zdCBjb29raWVTdG9yZSA9IGNvb2tpZXMoKTtcbiAgY29uc3QgdG9rZW4gPSBjb29raWVTdG9yZS5nZXQoQURNSU5fQ09PS0lFX05BTUUpPy52YWx1ZTtcblxuICBpZiAoaXNWYWxpZEFkbWluVG9rZW4odG9rZW4pKSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgYXV0aGVudGljYXRlZDogdHJ1ZSB9KTtcbiAgfVxuXG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGF1dGhlbnRpY2F0ZWQ6IGZhbHNlIH0sIHsgc3RhdHVzOiA0MDEgfSk7XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiY29va2llcyIsImlzVmFsaWRBZG1pblRva2VuIiwiQURNSU5fQ09PS0lFX05BTUUiLCJHRVQiLCJjb29raWVTdG9yZSIsInRva2VuIiwiZ2V0IiwidmFsdWUiLCJqc29uIiwiYXV0aGVudGljYXRlZCIsInN0YXR1cyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/admin/check/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/adminConfig.ts":
/*!********************************!*\
  !*** ./src/lib/adminConfig.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ADMIN_COOKIE_NAME: () => (/* binding */ ADMIN_COOKIE_NAME),\n/* harmony export */   ADMIN_CREDENTIALS: () => (/* binding */ ADMIN_CREDENTIALS),\n/* harmony export */   ADMIN_SESSION_SECRET: () => (/* binding */ ADMIN_SESSION_SECRET),\n/* harmony export */   isValidAdminToken: () => (/* binding */ isValidAdminToken),\n/* harmony export */   verifyAdminCredentials: () => (/* binding */ verifyAdminCredentials)\n/* harmony export */ });\n/**\n * ADMIN CREDENTIALS CONFIGURATION\n * \n * You can change the admin username and password directly here in code.\n * Changes will take effect immediately upon saving this file.\n */ const ADMIN_CREDENTIALS = {\n    // Change your admin login username here:\n    username: process.env.ADMIN_USERNAME || \"admin\",\n    // Change your admin login password here:\n    password: process.env.ADMIN_PASSWORD || \"dof2026admin\"\n};\nconst ADMIN_COOKIE_NAME = \"dof_admin_session_token\";\n// Fixed internal secret token for session validation\nconst ADMIN_SESSION_SECRET = \"dof_secure_admin_auth_token_2026_biougra\";\nfunction verifyAdminCredentials(user, pass) {\n    return user === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password;\n}\nfunction isValidAdminToken(token) {\n    return token === ADMIN_SESSION_SECRET;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2FkbWluQ29uZmlnLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7O0NBS0MsR0FDTSxNQUFNQSxvQkFBb0I7SUFDL0IseUNBQXlDO0lBQ3pDQyxVQUFVQyxRQUFRQyxHQUFHLENBQUNDLGNBQWMsSUFBSTtJQUV4Qyx5Q0FBeUM7SUFDekNDLFVBQVVILFFBQVFDLEdBQUcsQ0FBQ0csY0FBYyxJQUFJO0FBQzFDLEVBQUU7QUFFSyxNQUFNQyxvQkFBb0IsMEJBQTBCO0FBRTNELHFEQUFxRDtBQUM5QyxNQUFNQyx1QkFBdUIsMkNBQTJDO0FBRXhFLFNBQVNDLHVCQUF1QkMsSUFBWSxFQUFFQyxJQUFZO0lBQy9ELE9BQU9ELFNBQVNWLGtCQUFrQkMsUUFBUSxJQUFJVSxTQUFTWCxrQkFBa0JLLFFBQVE7QUFDbkY7QUFFTyxTQUFTTyxrQkFBa0JDLEtBQXlCO0lBQ3pELE9BQU9BLFVBQVVMO0FBQ25CIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZGVmZW5kZXJzLW9mLWZ1dHVyZS8uL3NyYy9saWIvYWRtaW5Db25maWcudHM/ZGY4MCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFETUlOIENSRURFTlRJQUxTIENPTkZJR1VSQVRJT05cbiAqIFxuICogWW91IGNhbiBjaGFuZ2UgdGhlIGFkbWluIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBkaXJlY3RseSBoZXJlIGluIGNvZGUuXG4gKiBDaGFuZ2VzIHdpbGwgdGFrZSBlZmZlY3QgaW1tZWRpYXRlbHkgdXBvbiBzYXZpbmcgdGhpcyBmaWxlLlxuICovXG5leHBvcnQgY29uc3QgQURNSU5fQ1JFREVOVElBTFMgPSB7XG4gIC8vIENoYW5nZSB5b3VyIGFkbWluIGxvZ2luIHVzZXJuYW1lIGhlcmU6XG4gIHVzZXJuYW1lOiBwcm9jZXNzLmVudi5BRE1JTl9VU0VSTkFNRSB8fCBcImFkbWluXCIsXG5cbiAgLy8gQ2hhbmdlIHlvdXIgYWRtaW4gbG9naW4gcGFzc3dvcmQgaGVyZTpcbiAgcGFzc3dvcmQ6IHByb2Nlc3MuZW52LkFETUlOX1BBU1NXT1JEIHx8IFwiZG9mMjAyNmFkbWluXCIsXG59O1xuXG5leHBvcnQgY29uc3QgQURNSU5fQ09PS0lFX05BTUUgPSBcImRvZl9hZG1pbl9zZXNzaW9uX3Rva2VuXCI7XG5cbi8vIEZpeGVkIGludGVybmFsIHNlY3JldCB0b2tlbiBmb3Igc2Vzc2lvbiB2YWxpZGF0aW9uXG5leHBvcnQgY29uc3QgQURNSU5fU0VTU0lPTl9TRUNSRVQgPSBcImRvZl9zZWN1cmVfYWRtaW5fYXV0aF90b2tlbl8yMDI2X2Jpb3VncmFcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeUFkbWluQ3JlZGVudGlhbHModXNlcjogc3RyaW5nLCBwYXNzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIHVzZXIgPT09IEFETUlOX0NSRURFTlRJQUxTLnVzZXJuYW1lICYmIHBhc3MgPT09IEFETUlOX0NSRURFTlRJQUxTLnBhc3N3b3JkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZEFkbWluVG9rZW4odG9rZW46IHN0cmluZyB8IHVuZGVmaW5lZCk6IGJvb2xlYW4ge1xuICByZXR1cm4gdG9rZW4gPT09IEFETUlOX1NFU1NJT05fU0VDUkVUO1xufVxuIl0sIm5hbWVzIjpbIkFETUlOX0NSRURFTlRJQUxTIiwidXNlcm5hbWUiLCJwcm9jZXNzIiwiZW52IiwiQURNSU5fVVNFUk5BTUUiLCJwYXNzd29yZCIsIkFETUlOX1BBU1NXT1JEIiwiQURNSU5fQ09PS0lFX05BTUUiLCJBRE1JTl9TRVNTSU9OX1NFQ1JFVCIsInZlcmlmeUFkbWluQ3JlZGVudGlhbHMiLCJ1c2VyIiwicGFzcyIsImlzVmFsaWRBZG1pblRva2VuIiwidG9rZW4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/adminConfig.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fcheck%2Froute&page=%2Fapi%2Fadmin%2Fcheck%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fcheck%2Froute.ts&appDir=C%3A%5CUsers%5Chamza%5CDesktop%5CDOF%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Chamza%5CDesktop%5CDOF&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();