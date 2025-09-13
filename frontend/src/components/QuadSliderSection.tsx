import SmallSlider from './SmallSlider';

const quadSliderHeight = "h-[42vh] md:h-[58vh] lg:h-[72vh] xl:h-[78vh]";

// Example images for each slider
const quadImages = {
  topLeft: [
    "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&w=600",
    "https://images.pexels.com/photos/225157/pexels-photo-225157.jpeg?auto=compress&w=600"
  ],
  topRight: [
    "https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&w=600",
    "https://images.pexels.com/photos/167832/pexels-photo-167832.jpeg?auto=compress&w=600"
  ],
  bottomLeft: [
    "https://images.pexels.com/photos/167832/pexels-photo-167832.jpeg?auto=compress&w=600",
    "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&w=600"
  ],
  bottomRight: [
    "https://images.pexels.com/photos/225157/pexels-photo-225157.jpeg?auto=compress&w=600",
    "https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&w=600"
  ]
};

const QuadSliderSection: React.FC = () => (
  <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden mb-20">
    {/* Increased mb-20 for more space below AdSlider */}
    <div
      className={`w-screen ${quadSliderHeight} grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 gap-2 px-2`}
      style={{ minHeight: '1px' }}
    >
      <div className="row-span-1 md:row-span-1 flex">
        <SmallSlider images={quadImages.topLeft} height="h-[32vw] md:h-[36vh] lg:h-[38vh]" />
      </div>
      <div className="row-span-1 md:row-span-1 flex">
        <SmallSlider images={quadImages.topRight} height="h-[32vw] md:h-[36vh] lg:h-[38vh]" />
      </div>
      <div className="row-span-1 md:row-span-1 flex">
        <SmallSlider images={quadImages.bottomLeft} height="h-[32vw] md:h-[36vh] lg:h-[38vh]" />
      </div>
      <div className="row-span-1 md:row-span-1 flex">
        <SmallSlider images={quadImages.bottomRight} height="h-[32vw] md:h-[36vh] lg:h-[38vh]" />
      </div>
    </div>
    {/* Mobile: Stack sliders vertically, ensure images are shown in full and not overlapping */}
    <style>
      {`
        @media (max-width: 768px) {
          .grid {
            display: flex !important;
            flex-direction: column;
            gap: 1rem;
            height: auto !important;
          }
          .grid > div {
            min-height: 200px;
            height: 60vw;
            position: relative;
          }
        }
      `}
    </style>
  </section>
);

export default QuadSliderSection;