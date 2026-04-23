import { Link } from "react-router-dom";

const PrivacyData = () => {

    const privacyPolicyData = [
        {
            title: "Introduction",
            description: "This Privacy Policy outlines how FitClue ('we,' 'us,' or 'our') collects, uses, shares, and protects your data. FitClue is a personal project and does not provide enterprise-level infrastructure or security. By using FitClue, you agree to the practices described in this policy."
        },
        {
            title: "Data Collection",
            description: (
                <div>
                    <p>FitClue collects the following categories of data:</p>
                    <ul className='list-unstyled'>
                        <li>
                            - Email Account Information: The email address you provide during account registration may be stored in the platform's database (Appwrite).
                        </li>
                        {/* ////////////////////////////////////////////////////////////////////// */}
                        {/* ////////////////////////////////////////////////////////////////////// */}
                        {/* ////////////////////////// Mention Appwrite's account.get() //////////////////////////// */}
                        {/* ////////////////////////////////////////////////////////////////////// */}
                        {/* ////////////////////////////////////////////////////////////////////// */}
                        <li>
                            - Username: The username you choose may be stored and may be visible to other users on the platform.
                        </li>
                        <li>
                            - Content Shared: This includes any text, comments, or links you post on the platform. Such content may remain visible to other users even after account deletion, unless it is removed or required to be deleted by law.
                        </li>
                        <li>
                            - Reporting Data: When you report content (comments, links, or embedded posts), we collect the unique ID of the reported item and the reason provided for the report. This information is used solely to investigate potential violations of our policies and to maintain platform safety.
                        </li>
                        <li>
                            - Technical Data: IP addresses and usage logs are collected by Appwrite on our behalf and are used for security, debugging, and maintaining platform performance.
                        </li>
                    </ul>
                    <p>
                        FitClue does not sell personal information to third parties.
                    </p>
                </div>
            )
        },
        {
            title: "Data Usage",
            description:
                <div>
                    <p>The data we collect is used to:</p>
                    <ul className='list-unstyled'>
                        <li>- Facilitate account creation.</li>
                        <li>- Display content and enable interactions within the platform.</li>
                        <li>
                            - Screen user-submitted content (including comments and links) for compliance with our <Link to='/tos' target='_blank'>Terms of Service</Link> and <Link to='/community-guidelines' target='_blank'>Community Guidelines</Link>.
                        </li>
                        <li>- Improve platform functionality and user experience.</li>
                    </ul>
                    <p>
                        Content that violates our policies is intended not to be published or made visible on the platform.
                    </p>
                </div>
        },
        {
            title: "Data Sharing",
            description: (
                <div>
                    <p>
                        FitClue does not sell or rent your data to third parties. However, data may be shared in the following circumstances:
                    </p>
                    <ul className='list-unstyled'>
                        <li>
                            - Service Providers: We use Appwrite to provide backend infrastructure and database services. Appwrite processes and stores data (including IP addresses) on our behalf as part of providing the platform.
                        </li>
                        <li>
                            {/* ////////////////////////////////////////////////////////////////////// */}
                            {/* ////////////////////////////////////////////////////////////////////// */}
                            {/* ////////////////////////// TO BE EDITED 👇//////////////////////////// */}
                            {/* ////////////////////////////////////////////////////////////////////// */}
                            {/* ////////////////////////////////////////////////////////////////////// */}
                            - AI-Powered Features: We use the Google Gemini API to review user-submitted content for compliance with our policies. When you submit content, it is processed by a backend function where it may be temporarily included in system logs for the purpose of execution, debugging, and automated moderation using the Google Gemini API. These logs are not part of the application's persistent database storage and are not used to publish or display content. Only content that passes moderation is stored in the database and made visible on the platform. Automated moderation systems may not be fully accurate and may incorrectly flag or allow content. Content processing by third-party services is subject to their own data handling practices. This process helps prevent harmful content from appearing on the platform while minimizing the data we retain. The handling of this data is governed by Google's policies, which we do not control.
                        </li>
                        <li>
                            - Legal Requirements: We may disclose data if required to do so by law or in response to valid legal requests.
                        </li>
                        <li>
                            - Platform Integrity: We may review data internally to investigate violations of our Terms of Service or to maintain the safety and integrity of the platform.
                        </li>
                    </ul>
                    <p>
                        Once data is shared with third-party providers, its handling is subject to their respective policies and practices.
                    </p>
                </div>
            )
        },
        {
            title: "Data Storage and Security",
            description:
                <div>
                    <p>
                        Your data may be stored on servers managed by our backend provider (Appwrite), which may be located in the EU or other regions depending on infrastructure configuration. By using FitClue, you acknowledge that your information may be transferred to, accessed, and processed in the United States or other regions where our administrative operations or service providers operate. While we take reasonable steps to protect your information, FitClue is a personal project and may not include certain enterprise-grade security features such as end-to-end encryption or mandatory multi-factor authentication. No method of transmission over the internet or electronic storage is completely secure. Therefore, we cannot guarantee absolute security of your data. You agree to:
                    </p>
                    <ul className='list-unstyled'>
                        <li>- Use strong passwords for your account.</li>
                        <li>- Avoid sharing sensitive personal information (such as financial information, government identification numbers, or private contact details) on the platform, as content may be visible to others and is not protected by advanced security measures.</li>
                    </ul>
                </div>
        },
        {
            title: "Data Retention",
            description: <div>
                <p>
                    We retain personal data only for as long as necessary to provide the service or comply with legal obligations.
                </p>
                <p>
                    System logs generated during backend processing may be retained for a limited period for security, debugging, and abuse prevention purposes and are not used for content publication or user-facing features.
                </p>
            </div>
        },
        {
            title: "User Rights",
            description:
                <div>
                    <p>
                        You have the right to:
                    </p>
                    <ul className='list-unstyled'>
                        <li>- Request correction of your data.</li>
                        <li>- Report privacy concerns or violations through the platform.</li>
                        <li>- Request deletion of your account and associated personal data, subject to technical limitations and legal obligations.</li>
                    </ul>
                    <p>
                        When an account is deleted, personal identifiers are removed from posts, but the substantive content of the post remains as part of the community's public record.
                    </p>
                    <p>
                        Depending on your location, you may have additional rights under applicable data protection laws, including the right to request access to or deletion of your personal data. We will make reasonable efforts to honor such requests where technically feasible and legally required.
                    </p>
                </div>
        },
        {
            title: "Cookies and Tracking",
            description:
                <div>
                    <p>
                        FitClue uses cookies and similar technologies to support core functionality and improve user experience.
                    </p>
                    <ul className='list-unstyled'>
                        <li>
                            - Authentication Cookies: Cookies set by Appwrite are used to manage user login sessions and keep you authenticated while using the platform.
                        </li>
                        {/* ////////////////////////////////////////////////////////////////////// */}
                        {/* ////////////////////////////////////////////////////////////////////// */}
                        {/* ////////////////////////// TO BE EDITED 👇//////////////////////////// */}
                        {/* ////////////////////////////////////////////////////////////////////// */}
                        {/* ////////////////////////////////////////////////////////////////////// */}
                        <li>
                            - Local Storage: FitClue stores a unique user identifier (generated by Appwrite) in your browser's local storage to maintain session persistence. This data remains on your device and is used only within the platform.
                        </li>
                        <li>
                            - Security & Anti-Abuse: We use Google reCAPTCHA to protect the platform from spam and automated abuse. This service may collect hardware and software information, such as device and browser data, and send it to Google for analysis. Its use is subject to Google's Privacy Policy and Terms of Service.
                        </li>
                        <li>
                            - Third-Party Content: FitClue embeds content from Instagram. These embedded posts may set cookies or collect data in accordance with Instagram's and Meta's privacy policies which we do not control or access. FitClue does not control these cookies and does not access the data collected by them.
                        </li>
                    </ul>
                    <p>
                        FitClue does not use cookies or similar technologies for advertising or tracking you across other websites.
                    </p>
                </div>
        },
        {
            title: "Monetization",
            description: `
      We reserve the right to introduce paid features or advertisements in the future, and this policy will be updated to reflect any new data practices.
    `
        },
        {
            title: "Children's Privacy",
            description: `
      FitClue is not intended for individuals under 18 years of age, in accordance with platform eligibility requirements. We do not knowingly collect personal data from children. If we become aware that such data has been collected, it will be deleted promptly.
    `
        },
        {
            title: "Updates to This Policy",
            description: `
      This Privacy Policy may be updated periodically. You will be notified of changes through platform announcements. Continued use of FitClue after updates constitutes acceptance of the revised policy.
    `
        },
        {
            title: "Contact Information",
            description: `
      For questions or concerns about this Privacy Policy, please contact us at: FitClue@altmails.com.
    `
        }
    ];

    return { privacyPolicyData };
}

export default PrivacyData;