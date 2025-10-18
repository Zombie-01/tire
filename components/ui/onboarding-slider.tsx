"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Түмэн-Дугуй-д тавтай морил",
    subtitle: "Монголын хамгийн том дугуйн онлайн дэлгүүр",
    image:
      "https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Дэлхийн шилдэг брэндүүдийн дугуйг танд хүргэж байна",
  },
  {
    id: 2,
    title: "Олон төрлийн дугуй",
    subtitle: "Таны машинд тохирох дугуйг олоорой",
    image:
      "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Michelin, Bridgestone, Continental болон бусад брэндүүд",
  },
  {
    id: 3,
    title: "Хурдан хүргэлт",
    subtitle: "Улаанбаатар хотод ажлын 1-2 өдөрт хүргэнэ",
    image:
      "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Чанартай үйлчилгээ, найдвартай хүргэлт",
  },
];

export function OnboardingSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const completeOnboarding = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    window.location.reload(); // Reload to reflect the change in ClientLayout
  };

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Skip Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={completeOnboarding}
          className="p-2 text-white/70 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Slide Content */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white sm:p-8 md:p-12">
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
              {slide.title}
            </h1>
            <h2 className="text-xl text-yellow-400 sm:text-2xl md:text-3xl">
              {slide.subtitle}
            </h2>
            <p className="text-white/80 leading-relaxed sm:text-lg md:text-xl">
              {slide.description}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-black/90 p-6 space-y-4 sm:p-8 md:p-12">
        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-yellow-500" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevSlide}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors disabled:opacity-50"
            disabled={currentSlide === 0}>
            <ChevronLeft size={20} />
            <span>Өмнөх</span>
          </button>

          {currentSlide === slides.length - 1 ? (
            <button
              onClick={completeOnboarding}
              className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              Эхлэх
            </button>
          ) : (
            <button
              onClick={nextSlide}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <span>Дараах</span>
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
