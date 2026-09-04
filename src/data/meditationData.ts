
import { Meditation } from "@/types";

export const meditations: Meditation[] = [
  {
    id: "med-flower",
    name: "Flower Meditation",
    description: "A powerful technique where you focus on a flower until there is no separation between you and the object of focus.",
    teacher: "Osho",
    instructions: "Find a comfortable place to sit. Place a flower in front of you at eye level. Focus your entire attention on the flower. Notice its color, texture, shape, and scent. Keep your attention fixed only on the flower. If your mind wanders, gently bring it back. Continue this practice for the set duration.",
    precautions: "Practice in a quiet place without distractions. Maintain a steady posture throughout the session.",
    benefits: "Increases focus, quiets the mind, develops deep concentration, enhances awareness of the present moment.",
    icon: "flower",
    duration: [5, 10, 15, 20, 30],
  },
  {
    id: "med-mother",
    name: "Universal Mother Meditation",
    description: "A compassion-based meditation where you consider yourself as a mother to every being in existence.",
    teacher: "Sadhguru",
    instructions: "Sit comfortably with your eyes closed. Bring to mind different people - loved ones, friends, strangers, even those you dislike. For each person, consciously feel as if they are your child. Experience the natural compassion and care a mother has for her child. Extend this feeling to everyone, including yourself.",
    precautions: "Don't rush through the people you visualize. Take time to genuinely feel the motherly connection with each person.",
    benefits: "Develops compassion, dissolves boundaries, reduces judgments, creates inner peace, promotes emotional healing.",
    icon: "heart",
    duration: [5, 10, 15, 20, 30],
  },
  {
    id: "med-isha",
    name: "Isha Kriya",
    description: "A simple yet powerful meditation focusing on breath and a specific thought process.",
    teacher: "Sadhguru",
    instructions: "Sit cross-legged with a slightly upturned face. Keep eyes closed and focus gently between the eyebrows. Be aware of your breath. Inhale and mentally say 'I am not the body'. Exhale and mentally say 'I am not even the mind'. Repeat for the duration of your practice.",
    precautions: "Keep your spine straight but not rigid. Don't strain your eyes trying to look at the spot between eyebrows - just maintain a gentle awareness of that area.",
    benefits: "Brings balance to the system, reduces stress and anxiety, promotes clarity of thought, enhances overall wellbeing.",
    icon: "brain",
    duration: [5, 10, 15, 20, 30],
  },
  {
    id: "med-dynamic",
    name: "Dynamic Meditation",
    description: "An active meditation technique designed to release repressed emotions and energy through physical movement.",
    teacher: "Osho",
    instructions: "This meditation has five stages: 1) Deep, chaotic breathing through the nose for 10 minutes. 2) Catharsis - express whatever needs to be expressed for 10 minutes. 3) Jump up and down shouting 'Hoo!' for 10 minutes. 4) Stop suddenly and freeze for 15 minutes. 5) Celebrate through dance for 15 minutes.",
    precautions: "Practice on an empty stomach. Wear comfortable clothing. Ensure you have enough space around you. If you have any heart conditions or physical limitations, consult a doctor before practicing.",
    benefits: "Releases emotional blockages, awakens dormant energy, brings vitality, refreshes the mind, promotes emotional healing.",
    icon: "zap",
    duration: [60],
  },
  {
    id: "med-nadi",
    name: "Nadi Shodhan Pranayama",
    description: "Alternate nostril breathing technique that balances the subtle energy channels in the body.",
    teacher: "Ancient Yogic Practice",
    instructions: "Sit comfortably with a straight spine. Close your right nostril with your thumb, inhale through the left nostril. Close the left nostril with your ring finger, release the right nostril, and exhale. Inhale through the right nostril, then close it, exhale through the left. This is one cycle. Continue for the duration of your practice.",
    precautions: "Practice on an empty stomach. Breathe naturally without strain. If you feel dizzy, return to normal breathing.",
    benefits: "Balances the left and right hemispheres of the brain, calms the nervous system, improves focus, purifies the energy channels.",
    icon: "wind",
    duration: [5, 10, 15, 20],
  },
  {
    id: "med-shambhavi",
    name: "Shambhavi Mahamudra",
    description: "A powerful kriya yoga technique that works with breath control and specific eye positioning.",
    teacher: "Sadhguru",
    instructions: "This sacred practice is taught only through proper initiation in the Inner Engineering program by Sadhguru. It cannot be learned correctly through written or verbal instructions alone.",
    precautions: "Do not attempt to practice this technique without proper initiation. Incorrect practice may lead to adverse effects. Never teach this technique to others if you are not authorized.",
    benefits: "Balances the system, enhances perception, improves physical and mental health, creates inner harmony, leads to deeper states of consciousness.",
    icon: "eye",
    duration: [21],
    isSecret: true
  }
];

export const getPublicMeditations = () => {
  return meditations.filter(m => !m.isSecret);
};

export const getSecretMeditation = () => {
  return meditations.find(m => m.isSecret);
};
