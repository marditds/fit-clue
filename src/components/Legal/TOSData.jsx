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
            title: 'Scope of Service',
            description: (
                <>
                    <p>
                        FitClue is a personal project and not a product of a large or well-established organization. Users should not expect the same level of infrastructure, security, or features typically provided by major, well-established platforms.
                    </p>
                    <p>
                        While every reasonable effort is made to ensure the reliability of the platform, FitClue cannot guarantee advanced security features or comprehensive protections against potential risks. Users are encouraged to use strong passwords and exercise caution when sharing sensitive information.
                    </p>
                </>
            )
        },
        {
            title: 'Account Creation',
            description:
                <p>
                    Any valid email owner can create an account with FitClue. By registering, users agree to provide a valid email address, which is collected and stored through FitClue's backend infrastructure, powered by Appwrite. This email is used solely for account management and communication purposes.
                </p>
        },
        {
            title: 'Security and Account Access',
            description:
                <p>
                    FitClue uses Google reCAPTCHA to prevent automated sign-ups during account creation. The platform does not provide additional security measures such as multi-factor authentication. Users are solely responsible for securing their accounts and are advised to use strong, unique passwords. FitClue is not liable for unauthorized access resulting from weak or compromised credentials.
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
                    By using FitClue, users accept full responsibility for any content they share on the platform. FitClue is not responsible for the accuracy, reliability, or legality of user-added content, including links. Users are solely responsible for ensuring their content complies with all applicable laws and does not infringe on the rights of others.
                </p>
        },
        {
            title: 'Exclusivity of Content',
            description: (
                <p>
                    FitClue does not guarantee or enforce the exclusivity of content shared by users. It is the user's responsibility to ensure they have the necessary rights and permissions to share any content on the platform.
                </p>
            )
        },
        {
            title: 'Content Moderation',
            description: (
                <p>
                    FitClue reserves the right to remove content or suspend accounts at its sole discretion if it deems the content inappropriate, harmful, or in violation of these terms. We are under no obligation to provide prior notice or justification for such actions.
                </p>
            )
        },
        {
            title: 'Link Management',
            description: (
                <p>
                    FitClue reserves the right to update, modify, or remove any links added by users at any time, with or without prior notice. Users acknowledge that the platform is under no obligation to notify them about such changes or provide any explanation or justification for them.
                </p>
            )
        },
        {
            title: 'Third-Party Affiliation and Services',
            description: (
                <>
                    <p>
                        FitClue utilizes various third-party services to provide its features. By using FitClue, you acknowledge and agree to be bound by the terms and policies of these third-party providers.
                    </p>
                    <p>
                        FitClue is not affiliated with or endorsed by Instagram or Meta. Any use of Instagram's embed functionality is subject to <a href='https://help.instagram.com/581066165581870' target='_blank' rel="noopener noreferrer">Instagram's Terms of Use</a> and <a href='https://www.facebook.com/terms.php' target='_blank'>Meta's Terms of Service</a>.
                    </p>
                    <p>
                        FitClue is not affiliated with or endorsed by Google. FitClue uses Google services, such as reCAPTCHA for security and the Google Gemini API for content moderation.
                    </p>
                    <p>
                        Google Gemini is integrated to scan users' links and comments to help ensure appropriateness before publication. However, FitClue does not guarantee the accuracy, appropriateness, or legality of this automated screening. Users are solely responsible for reviewing and modifying content before posting. Any use of Google services is subject to <a href='https://policies.google.com/terms' target='_blank'>Google's Terms of Service</a> and their <a href='https://www.google.com/search?q=https://policies.google.com/terms/generative-ai/prohibited-use' target='_blank'>Generative AI Prohibited Use Policy</a>.
                    </p>
                    <p>
                        Additionally, FitClue uses Appwrite Cloud to provide backend infrastructure, including user account creation, authentication, and data storage/management. These services are operated by the Appwrite Team and may also rely on Appwrite's own integrated third-party providers. As a result, any issues related to availability, performance, or data loss stemming from Appwrite or its integrated providers are beyond FitClue's control. By using FitClue, you acknowledge that the platform's reliability partly depends on the performance of these third-party services. Any use of Appwrite's services is subject to <a href='https://appwrite.io/terms' target='_blank' rel="noopener noreferrer">Appwrite's Terms and Conditions</a>.
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
                        To the fullest extent permitted by law, FitClue and its creator(s) disclaim all liability for any damages, losses, or claims arising from your access to or use of the platform; any content posted by you or other users; third-party services or integrations (e.g., Appwrite, Google Gemini, Instagram); downtime, data loss, or service interruptions; and unauthorized access to your account due to weak credentials or user negligence.
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
                        FitClue reserves the right to suspend or terminate user accounts at any time, with or without notice, for conduct that violates these Terms of Service, disrupts the platform, or is otherwise deemed harmful or inappropriate.
                    </p>
                    <p>
                        Users may also choose to stop using the platform at any time. Termination may result in the deletion of all associated user data, including account credentials.
                    </p>
                    <p>
                        However, user-generated content, such as comments and posted links, may remain visible on the platform after account deletion, and the associated username will be replaced with 'Deleted User'. FitClue is under no obligation to remove such content unless required by law.
                    </p>
                </>
            )
        },
        {
            title: 'Visual and Media Assets',
            description: (
                <>
                    <p>
                        Images displayed on FitClue's sign-up and sign-in pages are sourced from Pexels (<a href='https://www.pexels.com' target='_blank' rel="noopener noreferrer">https://www.pexels.com</a>) and are used in accordance with Pexels' licensing terms. Copyright in these images remains with their respective photographers.
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
                        These Terms of Service are governed by and construed in accordance with the laws of the jurisdiction in which the creator of FitClue resides, without regard to its conflict of law provisions.
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
                    These Terms of Service may be updated at any time without prior notice. By continuing to use FitClue after changes are made, users agree to the revised terms. It is the user's responsibility to review the Terms periodically to remain informed.
                </p>
            )
        }
    ];

    return { tosData };
}

export default TOSData;
