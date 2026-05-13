/**
 * Configuration for Technical Difficulties Banner
 *
 * This file controls whether the technical difficulties banner is shown
 * and what message is displayed to users.
 *
 * To enable/disable or customize the banner, modify the config below.
 */

export interface TechnicalIssueConfig {
  enabled: boolean;
  message?: string;
  affectedFeatures?: string[];
  persistent?: boolean;
}

/**
 * Main configuration for technical difficulties banner
 *
 * @example
 * // Disable the banner
 * export const technicalIssueConfig: TechnicalIssueConfig = {
 *   enabled: false,
 * };
 *
 * @example
 * // Show with specific affected features
 * export const technicalIssueConfig: TechnicalIssueConfig = {
 *   enabled: true,
 *   message: "Maintenance in progress. Some features are temporarily unavailable.",
 *   affectedFeatures: ["Video Calls", "Room Creation", "Real-time Sync"],
 *   persistent: true,
 * };
 */
export const technicalIssueConfig: TechnicalIssueConfig = {
  enabled: false, // Set to true to show the banner
  message:
    "We're experiencing some technical difficulties. Some features may not work as expected.",
  affectedFeatures: [],
  persistent: false,
};
