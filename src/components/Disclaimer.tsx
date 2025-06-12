import '../styles/Disclaimer.scss';

const Disclaimer: React.FC = () => {
  return (
    <div className="disclaimer-container">
      <div className="disclaimer-logo" />
      <div>
        <h1 className="disclaimer-title">DISCLAIMER</h1>
        <div className="disclaimer-subtitle">
          <strong>Last updated </strong>
          <strong>June 05, 2025</strong>
        </div>
        <div className="disclaimer-heading">WEBSITE DISCLAIMER</div>
        <div className="disclaimer-text">
          The information provided by Alec Hsu ("we," "us," or "our") on{' '}
          <a
            href="https://snippets-frontend-ogbf.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="disclaimer-link"
          >
            https://snippets-frontend-ogbf.onrender.com
          </a>{' '}
          (the "Site") and our mobile application is for general informational purposes only. All information on the Site and our mobile application is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site or our mobile application.
        </div>
        <div className="disclaimer-text">
          UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR OUR MOBILE APPLICATION OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE AND OUR MOBILE APPLICATION. YOUR USE OF THE SITE AND OUR MOBILE APPLICATION AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE AND OUR MOBILE APPLICATION IS SOLELY AT YOUR OWN RISK.
        </div>
      </div>
    </div>
  );
};

export default Disclaimer; 