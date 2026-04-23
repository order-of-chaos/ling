"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const require_literal_keys_1 = __importDefault(require("./rules/require-literal-keys"));
const plugin = {
    meta: {
        name: '@orderofchaos/eslint-plugin-ling',
        version: '0.1.0',
    },
    rules: {
        'require-literal-keys': require_literal_keys_1.default,
    },
    configs: {
        recommended: {
            plugins: ['@orderofchaos/ling'],
            rules: {
                '@orderofchaos/ling/require-literal-keys': 'error',
            },
        },
    },
};
module.exports = plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLHdGQUE4RDtBQUU5RCxNQUFNLE1BQU0sR0FBRztJQUNiLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxrQ0FBa0M7UUFDeEMsT0FBTyxFQUFFLE9BQU87S0FDakI7SUFDRCxLQUFLLEVBQUU7UUFDTCxzQkFBc0IsRUFBRSw4QkFBa0I7S0FDM0M7SUFDRCxPQUFPLEVBQUU7UUFDUCxXQUFXLEVBQUU7WUFDWCxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztZQUMvQixLQUFLLEVBQUU7Z0JBQ0wseUNBQXlDLEVBQUUsT0FBTzthQUNuRDtTQUNGO0tBQ0Y7Q0FDRixDQUFDO0FBRUYsaUJBQVMsTUFBTSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlcXVpcmVMaXRlcmFsS2V5cyBmcm9tICcuL3J1bGVzL3JlcXVpcmUtbGl0ZXJhbC1rZXlzJztcblxuY29uc3QgcGx1Z2luID0ge1xuICBtZXRhOiB7XG4gICAgbmFtZTogJ0BvcmRlcm9mY2hhb3MvZXNsaW50LXBsdWdpbi1saW5nJyxcbiAgICB2ZXJzaW9uOiAnMC4xLjAnLFxuICB9LFxuICBydWxlczoge1xuICAgICdyZXF1aXJlLWxpdGVyYWwta2V5cyc6IHJlcXVpcmVMaXRlcmFsS2V5cyxcbiAgfSxcbiAgY29uZmlnczoge1xuICAgIHJlY29tbWVuZGVkOiB7XG4gICAgICBwbHVnaW5zOiBbJ0BvcmRlcm9mY2hhb3MvbGluZyddLFxuICAgICAgcnVsZXM6IHtcbiAgICAgICAgJ0BvcmRlcm9mY2hhb3MvbGluZy9yZXF1aXJlLWxpdGVyYWwta2V5cyc6ICdlcnJvcicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59O1xuXG5leHBvcnQgPSBwbHVnaW47XG4iXX0=