import {
  describe,
  test,
  expect,
  chromium,
  beforeAll,
  afterAll,
} from "@playwright/test";

const homePageSelectors = {
  juniperSquareLogo: "#brand-img",
  pageContainer: "#wrap",
  searchBarTextField: "#search",
  searchBarResults: "span.tt-suggestions",
  searchBarFirstResult: "span.tt-suggestions div.tt-suggestion:nth-of-type(1)",
  navbar: "div[role='navigation']",
  navbarUserMenu: "#navbar-user-menu",
  contactsTab: "[data-cy='contacts-link']",
  accountsTab: "#navbar-user-menu a[href='/accounts']",
  investmentsTab: "#navbar-user-menu a.dropdown-toggle",
  offeringsLink: "ul.dropdown-menu a[href='/offerings']",
  investmentEntitiesLink: "ul.dropdown-menu a[href='/entities']",
  helpTab: "#navbar-user-menu a[href='https://help.junipersquare.com/']",
  dashboard: "#page-body",
  activityBar: "div[data-cmp='filter_bar/activity_feed_filter_bar']",
  activityFeedList: "#activity_feed_list",
  userDropDownTab: "[data-cy='user-dropdown-toggle']",
  adminSettingsLink: "a[href='/admin_settings']",
  dropdownLinksForNavigation:
    "#navbar-user-menu ul.navbar-right li.dropdown a[href='#']",
  logoutLink: "li[data-cy='logout'] a",
  assetsLink: "a[href='/assets']",
  yourTasksTabLink: "#your-tasks-tab",
  delegatedTasksTabLink: "#delegated-tasks-tab",
  viewAllTaskslink: "#view-all-tasks",
  addTaskFromYourTasksTabLink: "a[href='/task/add']",
  addTaskFromDelegatedTasksTabLink:
    "a[href='/task/add?active_tab=delegated_tasks']",
  viewAllUnassignedTasksLink: "a[href='/tasks?assignee=-1']",
  addTaskSubjectField: "#deformField0-subject",
  addTaskAssigneeField: "#deformField0-assignee",
  addTaskDueDateField: "#deformField0-date_due-date",
  addTaskPriorityField: "#deformField0-priority_id",
  saveTaskButton: "#edit_task_form_new_save",
  activityMoreLink: "#activity-more-link",
  taskAssigneeMeText: "[data-cy='task-assignee-me']:visible",
  taskAssigneeDelegatedText: "[data-cy='task-assignee-delegated']:visible",
  taskDueDateText: "[data-cy='task-due-date']:visible",
  taskSubject: "[data-cy='task-subject']:visible",
  yourSettings: "[data-cy='your-settings']",
  adminSettings: "[data-cy='admin-settings']",
};

const loginPageSelectors = {
  jsqHeaderLogo: "[data-cy='brand-img']",
  jsqLogo: "#brand-img",
  emailTextField: "[data-cy='signin-email-input']",
  passwordTextField: "[data-cy='signin-password-input']",
  rememberMeCheckBox: "input[name='remember_me']",
  signInButton1: "#signin_tab button[type='submit']",
  signInButton: "[data-cy='signin-button']",
  forgotYourPasswordLink: "[data-cy='reset-link']",
  needHelpLink: "div.login-hints a[data-suffix='junipersquare.com']",
  wrongCredentialErrorMessage: ".form-error",
  sendResetInformationButton: "[data-cy='send-reset-information-button']",
  authenticationCodeTextField: "input[name='admin_auth_token']",
  digitAuthenticationCodeTextBox: ".form-control",
  continueButton: ".btn",
  errorMessage: "[data-cy='signin-error']",
  twoFAPhoneNumberTextField: "input[data-cy='phone-number-input']",
  twoFAPhoneNumberSubmitButton: "button[data-cy='two-fa-phone-number-submit']",
  twoFAVerificationTextField: "input[data-cy='verification-token-input']",
  twoFASubmitButton: "button[data-cy='two-fa-submit-button']",
};
let browser, page;
test.beforeEach(async () => {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto("https://rockstonecap.test.junipersquare.us/login");
});

test.afterAll(async () => {
  await browser.close();
});
test.describe("Staff login", () => {
  //const userCredentials = getUser({ productArea: "staff" });
  // const checkAllElementsOnPageVisible = async () => {
  //   await expect(page).toHaveSelector(loginPageSelectors.jsqHeaderLogo);
  //   await expect(page).toHaveSelector(loginPageSelectors.emailTextField);
  //   await expect(page).toHaveSelector(loginPageSelectors.passwordTextField);
  //   await expect(page).toHaveSelector(loginPageSelectors.signInButton);
  //   await expect(page).toHaveSelector(
  //     loginPageSelectors.forgotYourPasswordLink
  //   );
  // };

  test("C136635; Verify that when user enters invalid credentials receive error message", async () => {
    await page.fill(loginPageSelectors.emailTextField, "qa1@junipersquare.com");
    await page.fill(loginPageSelectors.passwordTextField, "bassword");
    await Promise.all([page.click(loginPageSelectors.signInButton)]);
    await expect(page.url()).toBe(
      "https://rockstonecap.test.junipersquare.us/login"
    );
    await page.waitForSelector(loginPageSelectors.errorMessage, {
      text: "Invalid email or password",
    });
  });

  test("C136632; Verify that when user clicks forget password link navigate", async () => {
    await page.fill(loginPageSelectors.emailTextField, "qa1@junipersquare.com");
    await Promise.all([page.click(loginPageSelectors.forgotYourPasswordLink)]);
    await expect(page.url()).toContain("/login");
    await page.waitForSelector(loginPageSelectors.sendResetInformationButton, {
      timeout: 7000,
    });
  });

  test("C136641; Verify that user can login with valid credentials", async () => {
    await page.fill(loginPageSelectors.emailTextField, "qa1@junipersquare.com");
    await page.fill(loginPageSelectors.passwordTextField, "Testpassword2020!");
    await Promise.all([page.click(loginPageSelectors.signInButton)]);
    await expect(page.url()).toBe(
      "https://rockstonecap.test.junipersquare.us/login"
    );
    await page.waitForSelector(homePageSelectors.navbarUserMenu);
    await page.waitForSelector(homePageSelectors.activityFeedList);
  });
});
