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
                            - <strong>Email Account Information:</strong> The email address you provide during account registration may be stored in the platform's database (Appwrite).
                        </li>
                        <li>
                            - <strong>Username:</strong> The username you choose may be stored and may be visible to other users on the platform.
                        </li>
                        <li>
                            - <strong>Comments:</strong> The text of any comment you submit is processed by our automated moderation system before publication. Comments that pass validation are stored in the platform database and may be visible to other users. Comments that fail validation are not stored in the database but may appear temporarily in system logs generated during processing.
                        </li>
                        <li>
                            - <strong>Links:</strong> When you submit a link that passes validation, the following data associated with that submission is stored in the platform database: the URL itself, the brand name you provide, the item description you provide, and the similarity level you indicate. Links that fail validation are not stored in the database but may appear temporarily in system logs generated during processing.
                        </li>
                        <li>
                            - <strong>Reporting Data:</strong> When you report content (comments, links, or embedded posts), we collect the unique ID of the reported item and the reason provided for the report. This information is used solely to investigate potential violations of our policies and to maintain platform safety.
                        </li>
                        <li>
                            - <strong>Technical Data:</strong> IP addresses and usage logs are collected by Appwrite on our behalf and are used for security, debugging, and maintaining platform performance.
                        </li>
                        <li>
                            - <strong>Contact Form Submissions:</strong> If you contact us via our contact form, the following information is collected: your email address, name, reason for contact, and message, along with a timestamp automatically recorded at the time of submission. This data is submitted through Google Forms and stored in Google Sheets, both services operated by Google LLC. It is accessible to FitClue administrators and is used solely to respond to your inquiry.
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
            description: (
                <div>
                    <p>The data we collect is used to:</p>
                    <ul className='list-unstyled'>
                        <li>- Facilitate account creation.</li>
                        <li>- Display content and enable interactions within the platform.</li>
                        <li>
                            - Validate user-submitted content (including comments and links) using automated rule-based systems to ensure compliance with our <Link to='/tos' target='_blank'>Terms of Service</Link> and <Link to='/community-guidelines' target='_blank'>Community Guidelines</Link>. For comments, this includes screening for URLs, profanity, hate speech, harassment, and spam. For links, this includes safety screening and an evaluation of commerce relevance to determine whether the link qualifies as a valid shopping or product link.
                        </li>
                        <li>- Improve platform functionality and user experience.</li>
                    </ul>
                    <p>
                        Content that does not pass validation is not published or made visible on the platform. Such content may be temporarily processed and included in system logs during validation but is not stored in the platform database.
                    </p>
                </div>
            )
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
                            - <strong>Service Providers:</strong> We use Appwrite to provide backend infrastructure and database services. Appwrite processes and stores data (including IP addresses) on our behalf as part of providing the platform.
                        </li>
                        <li>
                            - <strong>Automated Comment Validation:</strong> Comments you submit are processed server-side by a rule-based moderation system before publication. This system screens for URLs, profane or sexually explicit language (including obfuscated variants), hate speech, harassment, and spam phrases. Comment text is processed entirely within FitClue's backend infrastructure and is not transmitted to any external service or third-party API as part of this process. Only comments that pass all checks are stored in the platform database.
                        </li>
                        <li>
                            - <strong>Automated Link Validation:</strong> Links you submit are processed through a two-stage server-side validation pipeline. In the first stage, the submitted URL is screened for safety: it is checked against blocked domain and banned top-level domain lists, scanned for adult or harmful content patterns (including obfuscated variants), and its hostname is resolved via DNS to verify that it does not point to a private, reserved, or internal network address. This DNS resolution involves transmitting the domain name of the submitted URL to DNS resolution infrastructure as part of a security check; no other user data is transmitted in this process. In the second stage, URLs that pass safety screening are evaluated by a scoring engine that analyzes URL structure, path patterns, and domain characteristics to determine commerce relevance. Only links that pass both stages are stored in the platform database.
                        </li>
                        <li>
                            - <strong>Contact Form Provider:</strong> If you use our contact form, your submission is processed by Google Forms and stored in Google Sheets, both operated by Google LLC. This is subject to Google's <a href='https://policies.google.com/terms' target='_blank'>Terms of Service</a> and <a href='https://policies.google.com/privacy' target='_blank'>Privacy Policy</a>.
                        </li>
                        <li>
                            - <strong>Legal Requirements:</strong> We may disclose data if required to do so by law or in response to valid legal requests.
                        </li>
                        <li>
                            - <strong>Platform Integrity:</strong> We may review data internally to investigate violations of our Terms of Service or to maintain the safety and integrity of the platform.
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
            description: (
                <div>
                    <p>
                        Your data may be stored on servers managed by our backend provider (Appwrite), which may be located in the EU or other regions depending on infrastructure configuration. By using FitClue, you acknowledge that your information may be transferred to, accessed, and processed in the United States or other regions where our administrative operations or service providers operate. While we take reasonable steps to protect your information, FitClue is a personal project and may not include certain enterprise-grade security features such as end-to-end encryption or mandatory multi-factor authentication. No method of transmission over the internet or electronic storage is completely secure. Therefore, we cannot guarantee absolute security of your data. You agree to:
                    </p>
                    <ul className='list-unstyled'>
                        <li>- Use strong passwords for your account.</li>
                        <li>- Avoid sharing sensitive personal information (such as financial information, government identification numbers, or private contact details) on the platform, as content may be visible to others and is not protected by advanced security measures.</li>
                    </ul>
                </div>
            )
        },
        {
            title: "Data Retention",
            description: (
                <div>
                    <p>
                        We retain personal data only for as long as necessary to provide the service or comply with legal obligations.
                    </p>
                    <p>
                        System logs generated during backend processing — including logs produced during comment and link validation — may be retained for a limited period for security, debugging, and abuse prevention purposes. These logs are not used for content publication or user-facing features.
                    </p>
                    <p>
                        When an account is deleted, your email address and username are permanently removed from the platform. Your posts and added links remain visible on the platform as part of the community's public record, and were never attributed to your username publicly. Any comments you left will continue to appear anonymized (e.g., replaced with "Deleted User"). Your internal account identifier is retained in the database alongside your content solely for data integrity purposes and is never displayed to other users.
                    </p>
                </div>
            )
        },
        {
            title: "User Rights",
            description: (
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
                        Depending on your location, you may have additional rights under applicable data protection laws, such as the right to access, correct, or delete your personal data. We will make reasonable efforts to comply with such requests where required by law and where technically feasible.
                    </p>
                </div>
            )
        },
        {
            title: "Cookies and Tracking",
            description: (
                <div>
                    <p>
                        FitClue uses cookies and similar technologies to support core functionality and improve user experience.
                    </p>
                    <ul className='list-unstyled'>
                        <li>
                            - <strong>Authentication Cookies:</strong> Cookies set by Appwrite may be used to manage user login sessions and keep you authenticated while using the platform. Their use may be subject to <a href='https://appwrite.io/terms' target='_blank' rel="noopener noreferrer">Appwrite's Terms and Conditions</a> and <a href='https://appwrite.io/privacy' target='_blank' rel="noopener noreferrer">Appwrite's Privacy Policy</a>.
                        </li>
                        <li>
                            - <strong>Security & Anti-Abuse:</strong> We use Google reCAPTCHA to protect the platform from spam and automated abuse. This service may collect hardware and software information, such as device and browser data, and send it to Google for analysis. Google processes this data on our behalf as a data processor, solely for providing the reCAPTCHA service.
                        </li>
                        <li>
                            - <strong>Third-Party Content:</strong> FitClue embeds content from Instagram. These embedded posts may set cookies or collect data in accordance with <a href='https://help.instagram.com/581066165581870' target='_blank' rel="noopener noreferrer">Instagram's Terms of Use</a>, <a href='https://www.facebook.com/terms.php' target='_blank' rel="noopener noreferrer">Meta's Terms of Service</a>, and <a href='https://privacycenter.instagram.com/policy' target='_blank' rel="noopener noreferrer">Meta's Privacy Policy</a>, which we do not control or access.
                        </li>
                    </ul>
                    <p>
                        FitClue does not use cookies or similar technologies for advertising or tracking you across other websites.
                    </p>
                </div>
            )
        },
        {
            title: "Monetization",
            description: `We reserve the right to introduce paid features or advertisements in the future, and this policy will be updated to reflect any new data practices.`
        },
        {
            title: "Children's Privacy",
            description: `FitClue is not intended for individuals under 18 years of age, in accordance with platform eligibility requirements. We do not knowingly collect personal data from children. If we become aware that such data has been collected, it will be deleted promptly.`
        },
        {
            title: "Updates to This Policy",
            description: `This Privacy Policy may be updated periodically. You will be notified of changes through platform announcements. Continued use of FitClue after updates constitutes acceptance of the revised policy.`
        },
        {
            title: "Contact Information",
            description: `For questions or concerns about this Privacy Policy, please contact us at: FitClue@altmails.com.`
        }
    ];

    return { privacyPolicyData };
}

export default PrivacyData;