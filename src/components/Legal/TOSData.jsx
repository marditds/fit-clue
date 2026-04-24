import { Link } from 'react-router-dom';

const TOSData = () => {
    const tosData = [
        {
            title: 'Acceptance of Terms',
            description:
                <p>
                    By accessing or using FitClue, you agree to be bound by these Terms of Service. Please read them carefully and ensure your compliance before using the platform.
                </p>
        },
        {
            title: 'Privacy',
            description: (
                <p>
                    Your use of FitClue is also governed by our <Link to='/privacy' target='_blank'>Privacy Policy</Link>, which explains how we collect, use, and store your data, including cookies, and embedded third-party content and services.
                </p>
            )
        },
        {
            title: 'Eligibility / Age Requirement',
            description: (
                <>
                    <p>
                        FitClue is intended only for users who are of legal age to form a binding contract in their jurisdiction (typically 18 years or older). By using FitClue, you represent and warrant that you meet this age requirement.
                    </p>
                    <p>
                        If you do not meet the legal age requirement, you must not access or use this platform. FitClue does not allow minors to use the service, and accounts of underage users will be terminated if discovered.
                    </p>
                </>
            )
        },
        {
            title: 'Scope of Service',
            description: (
                <>
                    <p>
                        FitClue is a personal project and does not provide the level of infrastructure, security, or features typically offered by large, established platforms. You should not expect the same level of infrastructure, security, or features typically provided by major, well-established platforms.
                    </p>
                    <p>
                        While every reasonable effort is made to ensure the reliability of the platform, FitClue cannot guarantee advanced security features or comprehensive protections against potential risks. You are encouraged to use strong passwords and exercise caution when sharing sensitive information.
                    </p>
                    <p>
                        FitClue does not guarantee uninterrupted availability of the platform and may experience downtime, maintenance periods, or service disruptions.
                    </p>
                </>
            )
        },
        {
            title: 'Account Creation',
            description:
                <p>
                    Any individual with a valid email address may create an account. By registering, you agree to provide a valid email address, which is stored through FitClue's backend infrastructure, powered by Appwrite. This email is used solely for account management and communication purposes.
                </p>
        },
        {
            title: 'Security and Account Access',
            description:
                <p>
                    FitClue uses Google reCAPTCHA to protect against spam and automated abuse, including account creation and other interactions. The platform does not provide additional security measures such as multi-factor authentication. You are solely responsible for securing your account and are advised to use strong, unique passwords. FitClue is not liable for unauthorized access resulting from weak or compromised credentials.
                </p>
        },
        {
            title: 'Account Transferability',
            description: (
                <p>
                    FitClue accounts are non-transferable and tied to the email address used during registration. Accounts cannot be transferred to other individuals or email addresses.
                </p>
            )
        },
        {
            title: 'Content Responsibility',
            description:
                <p>
                    By using FitClue, you accept full responsibility for any content you share on the platform. FitClue is not responsible for the accuracy, reliability, or legality of user-added content, including links. You are solely responsible for ensuring your content complies with all applicable laws and does not infringe on the rights of others.
                </p>
        },
        {
            title: 'Exclusivity of Content',
            description: (
                <p>
                    FitClue does not guarantee or enforce the exclusivity of content shared by you. It is your responsibility to ensure that you have the necessary rights and permissions to share any content on the platform.
                </p>
            )
        },
        {
            title: 'Content Moderation',
            description: (
                <>
                    <p>
                        FitClue uses automated, rule-based systems to review all user-submitted content — including links and comments — before it is published. These systems run server-side and apply validation logic, including keyword filtering, pattern matching, domain analysis, and network security checks. Content that does not pass validation is rejected and will not be published on the platform.
                    </p>
                    <p>
                        <strong>Comments</strong>
                    </p>
                    <p>
                        All comments are screened automatically prior to submission. The following categories of content are prohibited and will result in automatic rejection:
                    </p>
                    <ul>
                        <li>
                            <strong>URLs and links</strong> — Comments may not contain any URLs or hyperlinks, including obfuscated or disguised variants. If your comment includes a link in any form, it will be rejected.
                        </li>
                        <li>
                            <strong>Profanity and sexually explicit language</strong> — Comments are screened for profane, vulgar, or sexually explicit language, including common character substitutions and leet-speak variants of prohibited terms.
                        </li>
                        <li>
                            <strong>Hate speech and discriminatory language</strong> — Comments that contain hate speech or language promoting discrimination based on race, ethnicity, religion, or similar characteristics are prohibited.
                        </li>
                        <li>
                            <strong>Harassment and bullying</strong> — Comments containing language that threatens, demeans, or targets individuals are prohibited. This includes direct insults, threats of harm, and language intended to humiliate.
                        </li>
                        <li>
                            <strong>Spam and promotional content</strong> — Comments that contain solicitation, self-promotion, referral phrases, or other promotional language are prohibited.
                        </li>
                    </ul>
                    <p>
                        These checks are applied against both the original comment text and normalized variants designed to detect obfuscated or disguised prohibited content.
                    </p>
                    <p>
                        <strong>Links</strong>
                    </p>
                    <p>
                        All submitted links are evaluated in two stages before being published:
                    </p>
                    <ul>
                        <li>
                            <strong>Safety screening</strong> — Every submitted link is checked against a list of blocked domains and banned top-level domains, screened for adult, explicit, or harmful content in both the raw URL and normalized variants (including leet-speak), and resolved via DNS to confirm that the domain does not point to a private, reserved, or internal network address. Links that fail any safety check are unconditionally rejected.
                        </li>
                        <li>
                            <strong>Commerce relevance scoring</strong> — Links that pass safety screening are then evaluated for commerce intent using an automated scoring engine. This engine analyzes URL structure, path patterns, query parameters, and domain characteristics to determine whether a link points to a shoppable or product-related destination. Links must meet a minimum commerce relevance threshold to be accepted. Links that are safe but do not meet this threshold — including links to social media platforms, general websites, or non-product pages — will be rejected as not qualifying as valid shopping links.
                        </li>
                    </ul>
                    <p>
                        These two stages are fully automated. There is no human review queue. Rejections from either stage are final unless you resubmit a different link.
                    </p>
                    <p>
                        <strong>General</strong>
                    </p>
                    <p>
                        User-submitted content may be temporarily processed and included in system logs during validation for execution, security, and debugging purposes. These logs are not used for publishing content and are not part of the platform's persistent content storage. Only content that passes all validation stages is stored in the platform database.
                    </p>
                    <p>
                        FitClue's validation systems are designed to reduce harmful, irrelevant, or non-compliant content but are not exhaustive or infallible. We do not guarantee that all invalid or harmful content will be detected, and users remain solely responsible for the content they submit.
                    </p>
                    <p>
                        FitClue reserves the right to remove content or suspend accounts at its sole discretion if content is deemed inappropriate, harmful, or in violation of these terms. We are under no obligation to provide prior notice or justification for such actions.
                    </p>
                    <p>
                        You may report specific comments, links, or embedded Instagram posts that violate our policies by using the report button associated with that content. Reports include the content ID and the reason for the report. Please note that while we provide tools to report individual pieces of content, we do not currently provide a feature to report user accounts directly.
                    </p>
                    <p>
                        As a platform host, we act expeditiously to remove content that is found to be illegal or in violation of our terms. However, FitClue is a personal project and does not guarantee specific response times for every report.
                    </p>
                </>
            )
        },
        {
            title: 'Link Management',
            description: (
                <p>
                    FitClue reserves the right to update, modify, or remove any links added by you at any time, with or without prior notice. You acknowledge that the platform is under no obligation to notify you about such changes or provide any explanation or justification for them.
                </p>
            )
        },
        {
            title: 'Third-Party Affiliation and Services',
            description: (
                <>
                    <p>
                        FitClue relies on various third-party services to provide core functionality, including backend infrastructure, security features, and embedded media. By using FitClue, you acknowledge that the platform's reliability partly depends on the performance of these third-party services.
                    </p>
                    <p>
                        By using FitClue, you acknowledge that your data may be processed by these third-party providers on our behalf. Such processing is subject to the respective terms, privacy policies, and acceptable use policies of those providers, which are independent of and not controlled by FitClue.
                    </p>
                    <p>
                        We encourage you to review the terms and privacy policies of the third-party services used by FitClue:
                    </p>
                    <ul>
                        <li>Instagram and Meta (embedded content)</li>
                        <li>Google (reCAPTCHA for spam and abuse prevention)</li>
                        <li>Appwrite (backend infrastructure, authentication, and data storage)</li>
                    </ul>
                    <p>
                        FitClue is not affiliated with or endorsed by Instagram, Meta, Google, or Appwrite.
                    </p>
                    <p>
                        Embedded Instagram content may be subject to <a href='https://help.instagram.com/581066165581870' target='_blank' rel="noopener noreferrer">Instagram's Terms of Use</a>, <a href='https://www.facebook.com/terms.php' target='_blank' rel="noopener noreferrer">Meta's Terms of Service</a>, and <a href='https://privacycenter.instagram.com/policy' target='_blank' rel="noopener noreferrer">Meta's Privacy Policy</a>.
                    </p>
                    <p>
                        FitClue uses Google reCAPTCHA to protect against spam and automated abuse. Use of Google services may be subject to Google's <a href='https://policies.google.com/terms' target='_blank'>Terms of Service</a>, and <a href='https://policies.google.com/privacy' target='_blank'>Privacy Policy</a>.
                    </p>
                    <p>
                        Additionally, FitClue uses Appwrite Cloud to provide backend infrastructure, including user account creation, authentication, and data storage/management. These services are operated by the Appwrite Team and may also rely on Appwrite's own integrated third-party providers. As a result, any issues related to availability, performance, or data loss stemming from Appwrite or its integrated providers are beyond FitClue's control. Any use of Appwrite's services may be subject to <a href='https://appwrite.io/terms' target='_blank' rel="noopener noreferrer">Appwrite's Terms and Conditions</a> and <a href='https://appwrite.io/privacy' target='_blank' rel="noopener noreferrer">Appwrite's Privacy Policy</a>.
                    </p>
                    <p>
                        These third-party terms and policies may change from time to time, and FitClue is not responsible for those changes.
                    </p>
                </>
            )
        },
        {
            title: 'Limitation of Liability',
            description: (
                <>
                    <p>
                        FitClue is provided on an 'as is' and 'as available' basis without warranties of any kind, either express or implied.
                        To the fullest extent permitted by law, FitClue and its creator(s) disclaim all liability for any damages, losses, or claims arising from your access to or use of the platform; any content posted by you or other users; third-party services or integrations (e.g., Appwrite, Google reCaptcha, Instagram); downtime, data loss, or service interruptions; and unauthorized access to your account due to weak credentials or negligence.
                    </p>
                    <p>
                        FitClue's content validation systems are designed to reduce harmful or non-compliant content but are not exhaustive. We do not guarantee the accuracy or completeness of these systems, and their limitations may result in content being incorrectly accepted or rejected. In particular, the commerce relevance scoring system used to evaluate link submissions is a best-effort estimation and may not correctly classify all URLs.
                    </p>
                    <p>
                        By using FitClue, you acknowledge and agree that you assume full responsibility for your use of the platform. Under no circumstances shall FitClue or its creator(s) be liable for any indirect, incidental, consequential, special, or punitive damages, even if advised of the possibility of such damages.
                    </p>
                </>
            )
        },
        {
            title: 'Termination of Service',
            description: (
                <>
                    <p>
                        FitClue reserves the right to suspend or terminate your account at any time, with or without notice, for conduct that violates these Terms of Service, disrupts the platform, or is otherwise deemed harmful or inappropriate.
                    </p>
                    <p>
                        You may also choose to stop using the platform at any time. Termination will result in the deletion of your account credentials, including your email address and username.
                    </p>
                    <p>
                        However, user-generated content, such as comments and posted links, may remain visible on the platform after account deletion. Posts, comments, and links were never publicly attributed to your username. Any comments you left will continue to appear anonymized (e.g., replaced with "Deleted User"). FitClue is under no obligation to remove such content unless required by law.
                    </p>
                </>
            )
        },
        {
            title: 'Visual and Media Assets',
            description: (
                <>
                    <p>
                        Images displayed on FitClue's sign-up, sign-in, password recovery, and support pages are sourced from Pexels (<a href='https://www.pexels.com' target='_blank' rel="noopener noreferrer">https://www.pexels.com</a>) and are used in accordance with Pexels' licensing terms. Copyright in these images remains with their respective photographers.
                    </p>
                    <p>
                        Some media displayed in the application is embedded directly from Instagram using Instagram's official embed functionality. All rights, title, and interest in such media remain the sole property of the original Instagram users.
                    </p>
                </>
            )
        },
        {
            title: 'Governing Law',
            description: (
                <>
                    <p>
                        These Terms of Service are governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
                    </p>
                    <p>
                        By using the platform, you agree to submit to the personal and exclusive jurisdiction of the local courts in that jurisdiction for any disputes arising out of or relating to these terms.
                    </p>
                </>
            )
        },
        {
            title: 'Terms Updates',
            description: (
                <p>
                    These Terms of Service may be updated at any time without prior notice. By continuing to use FitClue after changes are made, you agree to the revised terms. It is your responsibility to review the Terms periodically to remain informed.
                </p>
            )
        }
    ];

    return { tosData };
}

export default TOSData;