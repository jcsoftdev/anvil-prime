import type { ImageMetadata } from 'astro';

import csFintechImg from '../assets/images/cs-fintech.jpg';
import csCloudImg from '../assets/images/cs-cloud.jpg';
import csHealthcareImg from '../assets/images/cs-healthcare.jpg';
import insightAiImg from '../assets/images/insight-ai-enterprise.jpg';
import insightCloudImg from '../assets/images/insight-cloud-native.jpg';
import insightCultureImg from '../assets/images/insight-engineering-culture.jpg';

export const caseStudyImages: Record<string, ImageMetadata> = {
  'ai-ml-platform': csFintechImg,
  'cloud-migration': csCloudImg,
  'digital-transformation': csHealthcareImg,
};

export const insightImages: Record<string, ImageMetadata> = {
  'future-of-ai': insightAiImg,
  'cloud-native-patterns': insightCloudImg,
  'engineering-culture': insightCultureImg,
};
