"use client";

import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const float = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(calc(100vw + 100%));
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const floatAround = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(100px, 50px) rotate(90deg);
  }
  50% {
    transform: translate(50px, 100px) rotate(180deg);
  }
  75% {
    transform: translate(-50px, 50px) rotate(270deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled Components
const PageContainer = styled.div`
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #43cea2, #185a9d);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  overflow: hidden;
  position: relative;
  padding: 2rem;
`;

const Clouds = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.6;
`;

interface CloudProps {
  size: number;
  top: number;
  duration: number;
}

const Cloud = styled.div<CloudProps>`
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50px;
  animation: ${float} linear infinite;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  width: ${(props: CloudProps) => props.size}px;
  height: ${(props: CloudProps) => props.size * 0.4}px;
  top: ${(props: CloudProps) => props.top}%;
  left: -${(props: CloudProps) => props.size}px;
  animation-duration: ${(props: CloudProps) => props.duration}s;
`;

interface ContainerProps {
  rotationX: number;
  rotationY: number;
}

const Container = styled.div<ContainerProps>`
  text-align: center;
  padding: 3rem;
  max-width: 900px;
  width: 100%;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  box-shadow: 0 8px 32px rgba(24, 90, 157, 0.15);
  transform-style: preserve-3d;
  perspective: 1000px;
  border: 1px solid rgba(67, 206, 162, 0.2);
  transform: rotateY(${(props: ContainerProps) => props.rotationY}deg) rotateX(${(props: ContainerProps) => props.rotationX}deg);
  transition: transform 0.1s ease-out;

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 2rem;
  }
`;

const ErrorCode = styled.div`
  font-size: 12rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #fff;
  text-shadow: 0 4px 24px #185a9d, 0 1px 0 #43cea2;
  letter-spacing: 5px;
  line-height: 1;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, transparent, #fff, transparent);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 8rem;
  }
`;

interface CompassProps {
  isSpinning: boolean;
}

const Compass = styled.div<CompassProps>`
  font-size: 6rem;
  margin: 2rem 0;
  animation: ${(props: CompassProps) => props.isSpinning ? rotate : 'none'} 1s linear infinite;
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));

  &:hover {
    transform: scale(1.2);
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 2rem 0;
  color: #fff;
  text-shadow: 0 2px 8px #185a9d;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Paragraph = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  line-height: 1.8;
  color: #fff;
  text-shadow: 0 1px 4px #185a9d22;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const HomeButton = styled.a`
  display: inline-block;
  padding: 1.2rem 3rem;
  background: linear-gradient(45deg, #43cea2, #185a9d);
  color: #fff;
  text-decoration: none;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(24, 90, 157, 0.2);
  margin-top: 1rem;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(24, 90, 157, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const TravelIcon = styled.span`
  font-size: 2.5rem;
  margin: 0 0.8rem;
  display: inline-block;
  animation: ${bounce} 2s infinite;
  filter: drop-shadow(0 0 5px #43cea2);
  vertical-align: middle;
`;

const FloatingElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

interface FloatingElementProps {
  top: string;
  left: string;
}

const FloatingElement = styled.div<FloatingElementProps>`
  position: absolute;
  font-size: 3rem;
  animation: ${floatAround} 10s linear infinite;
  filter: drop-shadow(0 0 5px #43cea2);
  top: ${(props: FloatingElementProps) => props.top};
  left: ${(props: FloatingElementProps) => props.left};
  opacity: 0.8;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
`;

export default function NotFound() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.pageX) / 30;
      const y = (window.innerHeight / 2 - e.pageY) / 30;
      setRotation({ x: y, y: x });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCompassClick = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 2000);
  };

  return (
    <PageContainer>
      <Clouds>
        <Cloud size={120} top={15} duration={35} />
        <Cloud size={180} top={35} duration={50} />
        <Cloud size={100} top={55} duration={40} />
        <Cloud size={150} top={75} duration={45} />
      </Clouds>

      <FloatingElements>
        <FloatingElement top="5%" left="5%">✈️</FloatingElement>
        <FloatingElement top="15%" left="85%">🗺️</FloatingElement>
        <FloatingElement top="85%" left="10%">🏖️</FloatingElement>
        <FloatingElement top="75%" left="90%">🌴</FloatingElement>
        <FloatingElement top="45%" left="20%">🏔️</FloatingElement>
        <FloatingElement top="35%" left="80%">🌅</FloatingElement>
      </FloatingElements>

      <Container rotationX={rotation.x} rotationY={rotation.y}>
        <ContentWrapper>
          <ErrorCode>404</ErrorCode>
          <Compass isSpinning={isSpinning} onClick={handleCompassClick}>
            🧭
          </Compass>
          <Title>Oops! Có vẻ như bạn đã đi lạc</Title>
          <Paragraph>
            Chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
            Có thể bạn đã rẽ nhầm hướng trong hành trình khám phá của mình.
          </Paragraph>
          <Paragraph>
            <TravelIcon>✈️</TravelIcon>
            Đừng lo lắng! Hãy để chúng tôi đưa bạn về trang chủ
            <TravelIcon>🏠</TravelIcon>
          </Paragraph>
          <HomeButton href="/">Về Trang Chủ</HomeButton>
        </ContentWrapper>
      </Container>
    </PageContainer>
  );
} 