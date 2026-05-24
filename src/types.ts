/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  name: string;
  role: string;
  star: number;
  text: string;
  date: string;
}

export interface Member {
  name: string;
  role: string;
  classCode: string;
  initials: string;
  bio: string;
  specialty: string;
  achievements: string[];
}

export interface Activity {
  id: string;
  category: string;
  title: string;
  description: string;
  highlights?: string;
  facebookLink?: string;
  moreDetails?: string;
}

export interface BentoItem {
  id: string;
  num: string;
  title: string;
  description: string;
  tag: string;
}
