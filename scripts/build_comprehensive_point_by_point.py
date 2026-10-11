import os
import json

CHAPTER_POINTS = {
    1: {
        "theme": "A Preamble to the Grand Itihāsa",
        "points": [
            {
                "section_title": "1. Canonical Standing as the Pañcama-Veda (Fifth Veda)",
                "points": [
                    "The Devas weighed the four Vedas on one scale and the Mahābhārata on the other; the Mahābhārata outweighed them in both gravity (mahattva) and weightiness (bhāravattva).",
                    "The Chāndogya Upaniṣad (7.1.2) explicitly authenticates Itihāsa and Purāṇa as the fifth Veda necessary for holistic knowledge.",
                    "Vedic truth is considered incomplete without narrative embodiment; abstract philosophy requires lived human drama to be fully grasped."
                ]
            },
            {
                "section_title": "2. Itihāsa vs. Aristotelian Epic: A Categorical Distinction",
                "points": [
                    "Classifying the Mahābhārata as an Aristotelian 'epic' imposes a foreign Greek hermeneutic focused solely on a unified heroic plot and catharsis.",
                    "An Itihāsa ('iti-ha-āsa' = 'so indeed it was') is an ontological pedagogical instrument designed to instruct humanity in all four Puruṣārthas (Dharma, Artha, Kāma, and Mokṣa).",
                    "Unlike tragic Greek drama, Itihāsa incorporates cyclic cosmic time, reincarnation, and karmic repercussions across multiple lifetimes."
                ]
            },
            {
                "section_title": "3. Protection Against the 'Alpaśruta' (The Half-Educated)",
                "points": [
                    "Mahābhārata 1.1.205 warns: 'Bibhety-alpaśrutād-vedo mām-ayaṁ prahariṣyati' — the Veda fears the person of half-knowledge who might mutilate its meaning.",
                    "Superficial textual literalism without experiential wisdom leads to rigid dogmatism and misapplied morality.",
                    "The epic serves as an essential explanatory commentary, wrapping subtle spiritual paradoxes in concrete moral choices."
                ]
            },
            {
                "section_title": "4. Cosmic Division of Vyāsa's 60-Lakh Composition",
                "points": [
                    "Maharṣi Vyāsa originally composed a vast corpus of 60 lakh (6 million) ślokas across cosmic realms.",
                    "30 lakh ślokas were allocated to the Devas, 15 lakh to the Pitṛs (ancestral realm), 14 lakh to the Gandharvas, and exactly 1 lakh (100,000) for human civilization.",
                    "The text studied by mortals represents a distilled, high-density essence tailored for human ethical dilemmas."
                ]
            },
            {
                "section_title": "5. The Allegorical Metaphor of the Two Great Trees",
                "points": [
                    "The Tree of Anger: Duryodhana represents the foliage, Karṇa the trunk, Śakuni the branches, Duḥśāsana the fruits, with blind king Dhṛtarāṣṭra as the root.",
                    "The Tree of Dharma: Yudhiṣṭhira represents the crown, Arjuna the trunk, Bhīma the branches, Nakula & Sahadeva the flowers/fruits, with Kṛṣṇa, the Vedas, and the Brahmavādins as the root.",
                    "Strategic insight: Any enterprise rooted in blind desire collapses under crisis, whereas structures grounded in cosmic wisdom withstand moral storms."
                ]
            }
        ]
    },
    2: {
        "theme": "Mahābhārata: A Brief Summary & Structural Overview",
        "points": [
            {
                "section_title": "1. Multi-Generational Karmic Cascade",
                "points": [
                    "The conflict of Kurukṣetra is not an isolated border skirmish but the convergence of multi-generational moral compromises beginning with Śantanu and Satyavatī.",
                    "Each generation attempts short-term political fixes that seed catastrophic long-term institutional vulnerabilities.",
                    "Strategic leadership requires anticipating how today's expediency becomes tomorrow's generational curse."
                ]
            },
            {
                "section_title": "2. The Three Concentric Layers of the Text",
                "points": [
                    "Jaya (24,000 verses): The original core focusing on victory and divine will composed by Vyāsa.",
                    "Bhārata (24,000–60,000 verses): Recited by Vaiśampāyana at Janamejaya's snake sacrifice.",
                    "Mahābhārata (100,000 verses): The expansive oral tradition recited by Sūta Ugraśravas to the sages in Naimiṣāraṇya.",
                    "The triadic expansion reflects how local clan history matures into universal human philosophy."
                ]
            },
            {
                "section_title": "3. The Paradox of Virtuous Flaws and Righteous Failures",
                "points": [
                    "Righteous figures (Yudhiṣṭhira, Bhīṣma, Droṇa) exhibit fatal blind spots: gambling addiction, excessive literalism, and state subordination.",
                    "Villainous figures (Karṇa, Duryodhana) exhibit exceptional loyalty, martial brilliance, and indomitable courage.",
                    "The narrative deliberately rejects naive moral dichotomies to train students in real-world nuanced ethical discernment."
                ]
            }
        ]
    },
    3: {
        "theme": "Mahābhārata What's and Whatnots: Hermeneutic Pitfalls",
        "points": [
            {
                "section_title": "1. Avoiding Decontextualized Modern Moral Imperialism",
                "points": [
                    "Judging Bronze-age Vedic civilization strictly through 21st-century secular lenses distorts the epic's core messages.",
                    "Every character's actions must be analyzed within their Svadharma (individual duty), Kuladharma (lineage duty), and Āpaddharma (emergency ethics).",
                    "Premature judgment without historical and spiritual empathy prevents deep cognitive transformation."
                ]
            },
            {
                "section_title": "2. Narrative Polyphony vs. Single Author Dogma",
                "points": [
                    "The epic refuses to offer single-line simplistic maxims; instead, it juxtaposes opposing philosophical debates in open council.",
                    "Yudhiṣṭhira's pacificism is challenged by Draupadī's kṣatriya pragmatism and Bhīma's muscular realism.",
                    "Leadership lesson: True wisdom emerges from cognitive synthesis of opposing viewpoints rather than ideological echo chambers."
                ]
            }
        ]
    },
    4: {
        "theme": "Dharmic Insights of a Butcher: The Vyādha Gītā",
        "points": [
            {
                "section_title": "1. Spiritual Hierarchy Subverted: The Ascetic vs. The Butcher",
                "points": [
                    "The ascetic brāhmaṇa Kauśika, proud of incinerating a crane with yogic gaze, is humbled by a humble householder woman and sent to learn Dharma from a meat-seller in Mithilā.",
                    "Dharma is not determined by external ritual purity, caste prestige, or severe penance, but by selfless execution of one's svadharma.",
                    "The Vyādha practices Ahimsā of the mind while performing his ancestral trade without cruelty or greed."
                ]
            },
            {
                "section_title": "2. Filial Duty and Household Life as Supreme Sādhanā",
                "points": [
                    "The Vyādha reveals his supreme spiritual altar: devoted, selfless service to his aging parents.",
                    "Abandoning family and social obligations under the guise of spiritual renunciation is an act of subtle escapism and adharma.",
                    "Realized spirituality must manifest in daily domestic integrity, emotional responsibility, and humility."
                ]
            }
        ]
    },
    5: {
        "theme": "The Unbroken Legacy: Continuity Across Dynastic Crises",
        "points": [
            {
                "section_title": "1. Institutional Resilience in Transition",
                "points": [
                    "The Kuru dynasty repeatedly faces biological extinction (Vicitravīrya's demise, Pāṇḍu's curse, Abhimanyu's death).",
                    "Through traditions like Niyoga and divine lineage invocation, the cultural and political continuity is rigorously sustained.",
                    "Adaptive leadership: Preserving core institutional purpose while adapting biological and procedural mechanisms."
                ]
            },
            {
                "section_title": "2. The Cost of Dynasty-Centric Obsession",
                "points": [
                    "When lineage survival becomes an end in itself rather than a vessel for Dharma, it degenerates into toxic nepotism.",
                    "Dhṛtarāṣṭra's inability to distinguish between the welfare of the state and the entitlement of his son catalyzes the ultimate cataclysm."
                ]
            }
        ]
    },
    6: {
        "theme": "A Timeless Itihāsa for Timely Needs",
        "points": [
            {
                "section_title": "1. The Living Relevance of Ancient Archetypes",
                "points": [
                    "The epic functions as a diagnostic mirror for modern human psychology, corporate governance, and ethical conflict.",
                    "Its characters do not represent antique relics but recurring psychological patterns present in every individual's daily choices.",
                    "Mokṣa-Śāstra orientation: Beyond social commentary, the epic's ultimate aim is internal liberation from egoic bondage."
                ]
            }
        ]
    },
    7: {
        "theme": "Pratijñā: The Ethics of Vows and Dilemmas of Commitment",
        "points": [
            {
                "section_title": "1. Sage Aṇīmāṇḍavya & Yama-Dharma: Justice Subordinate to Higher Dharma",
                "points": [
                    "The innocent sage Aṇīmāṇḍavya survives being impaled upon a spear and questions Yama-Dharma in the afterlife regarding his punishment.",
                    "Yama reveals he was punished for piercing the tail of a blade-fly with a grass stalk as a young child under twelve.",
                    "The sage curses Yama to be born as a mortal (Vidura) because scriptures state acts before the age of discernment carry no karmic guilt. Foundational lesson: Even the Cosmic Judge is subordinate to higher Dharma."
                ]
            },
            {
                "section_title": "2. Devavrata (Bhīṣma) — The Terrible Vow vs State Welfare",
                "points": [
                    "Devavrata takes a spontaneous, catastrophic vow of lifelong celibacy and throne abdication to satisfy King Śantanu's infatuation with Satyavatī.",
                    "His oath catered exclusively to his father's personal kāma (desire), lacking any strategic necessity for state security or national welfare.",
                    "By abdicating his administrative duty as Yuvarāja without royal council or consultation, Bhīṣma left the kingdom vulnerable to decades of instability and the eventual slaughter of 18 akṣauhiṇīs."
                ]
            },
            {
                "section_title": "3. The Tragedy of Ascetic Vanity: Refusal of Niyoga",
                "points": [
                    "When Satyavatī's sons died heirless, Satyavatī—the sole surviving beneficiary of the vow—begged Bhīṣma to break his vow, marry the widows, and assume the kingship.",
                    "Bhīṣma obstinately refused, placing the preservation of his personal ascetic reputation above the survival of the dynasty and state.",
                    "His rigid vow turned him into a paralyzed spectator during Draupadī's public disrobing and forced his sword into the service of Duryodhana's corrupt empire."
                ]
            },
            {
                "section_title": "4. Gāndhārī’s Pratijñā — Misplaced Sacrifice and Emotional Blindness",
                "points": [
                    "Upon learning her arranged husband was blind, Princess Gāndhārī immediately blindfolded herself in a spontaneous emotional reaction.",
                    "While celebrated as devotion, this hasty vow abandoned her role as a complementary partner and moral guide to her blind husband.",
                    "By closing her eyes, she was incapacitated as a mother, turning a literal and moral blind eye to Duryodhana's escalating evil and improper upbringing."
                ]
            },
            {
                "section_title": "5. Arjuna’s Pratijñā — Wrath vs Military Realism",
                "points": [
                    "Enraged by the adharmic slaughter of his son Abhimanyu, Arjuna impulsively vowed to kill Jayadratha before sunset the following day or immolate himself.",
                    "Droṇācārya and the Kaurava high command capitalized on this rash oath by creating a 3-tier defensive fortress (vyūhas) to run out the clock.",
                    "Arjuna was saved from ritual suicide only through Śrī Kṛṣṇa's cosmic tactical intervention (masking the sun with the Sudarśana Cakra)."
                ]
            },
            {
                "section_title": "6. Bhīma’s Pratijñā — Vows Subordinated to Universal Peace",
                "points": [
                    "Bhīma swore bloody oaths to drink Duḥśāsana's blood and smash Duryodhana's thighs during Draupadī's humiliation.",
                    "Crucially, when Kṛṣṇa prepared for his diplomatic peace mission to Hastināpura, Bhīma endorsed peace over war, showing he was willing to abandon personal vengeance for collective welfare.",
                    "In the final duel, he shattered Duryodhana's thigh not out of blind personal rage, but in accordance with Kṛṣṇa's tactical instruction to neutralize adharma."
                ]
            },
            {
                "section_title": "7. Śrī Kṛṣṇa — The Supreme Pratijñā Archetype (Teleological Ethics)",
                "points": [
                    "Śrī Kṛṣṇa pledged not to raise weapons in the Kurukṣetra war, serving solely as an unarmed charioteer.",
                    "When Bhīṣma unleashed slaughter upon the Pāṇḍavas while exploiting his Icchāmṛtyu boon, Kṛṣṇa broke his oath, seizing a heavy chariot wheel to slay Bhīṣma.",
                    "Supreme philosophical insight: An oath is merely an instrument in service of Dharma. Clinging to a vow when it protects adharma is ego, not virtue."
                ]
            },
            {
                "section_title": "8. The Two-Step Reflective Framework for Everyday Decision-Making",
                "points": [
                    "Filter 1 (Origin Analysis): Did the commitment originate from intellectual clarity and strategic foresight, or was it a reactive emotional outburst in a tense crisis?",
                    "Filter 2 (Continuity Analysis): In light of evolving realities, does strict adherence to this oath still foster collective welfare and righteousness, or has it become an act of egoic vanity?"
                ]
            }
        ]
    },
    8: {
        "theme": "Karṇa: The Maestro Who Went Wide of the Mark",
        "points": [
            {
                "section_title": "1. Extraordinary Valor Compromised by Misplaced Allegiance",
                "points": [
                    "Karṇa possessed matchless generosity, unmatched martial prowess, and unwavering loyalty to his benefactor Duryodhana.",
                    "However, by anchoring his identity to personal resentment and gratitude toward an unjust king, his virtues were co-opted to shield adharma.",
                    "ADM principle: Loyalty to an unethical leader or toxic enterprise corrupts the most noble personal qualities."
                ]
            },
            {
                "section_title": "2. The Curse of Foundational Deceit",
                "points": [
                    "Karṇa deceived Sage Paraśurāma regarding his lineage to acquire Brahmāstra knowledge.",
                    "The resulting curse caused his sacred mantras to fail at the exact moment of mortal crisis.",
                    "Core ethical law: Knowledge obtained through falsehood collapses under operational pressure."
                ]
            }
        ]
    },
    9: {
        "theme": "Kingship and Polity Acumen: Rajadharma in the Shanti Parva",
        "points": [
            {
                "section_title": "1. Danda (Justice) as the Pillar of Civil Order",
                "points": [
                    "On the bed of arrows, Bhīṣma instructs Yudhiṣṭhira on statecraft: Without Daṇḍa (measured executive enforcement), the strong consume the weak like big fish devouring small fish (Matsyanyāya).",
                    "The ruler's personal ascetic inclination must not supersede the duty to protect citizens through firm rule of law."
                ]
            },
            {
                "section_title": "2. The Ruler as Trustee, Not Owner",
                "points": [
                    "The king is described as a servant of the people (prajā-sevaka), holding state treasury and power in sacred trust.",
                    "Taxes must be gathered gently like a bee collecting nectar from flowers without harming the blossom."
                ]
            }
        ]
    },
    10: {
        "theme": "Mahābhārata in Adages: Practical Wisdom for Modern Life",
        "points": [
            {
                "section_title": "1. Proverbial Truths Distilled Across Generations",
                "points": [
                    "'Dharmo rakṣati rakṣitaḥ' (Dharma protects those who protect it) is not blind mysticism but a psychological and sociological law of reciprocal stability.",
                    "'Yato dharmas tato jayaḥ' (Where there is Dharma, there is victory) redefines victory from short-term conquest to ultimate spiritual alignment."
                ]
            }
        ]
    },
    11: {
        "theme": "Popular Regional Tales: Polyphony of the Living Tradition",
        "points": [
            {
                "section_title": "1. Grassroots Retellings and Folk Interpretations",
                "points": [
                    "Across Indian languages (Tamil Villiputturar, Bengali Kashiram Das, Malayalam Ezhuthachan), local adaptations introduce folk characters and sub-narratives.",
                    "These variations highlight regional perspectives on justice, gender, and devotion without eroding the core Vedic framework."
                ]
            }
        ]
    },
    12: {
        "theme": "Strategical Silhouette of an Extraordinary Peace Mission",
        "points": [
            {
                "section_title": "1. Kṛṣṇa's Diplomatic Masterclass in Hastināpura",
                "points": [
                    "Kṛṣṇa travels as peace envoy not because he expects Duryodhana to surrender, but to exhaust every peaceful avenue before war.",
                    "Strategic objective: Expose Duryodhana's intransigence publicly to win the moral high ground and rally uncommitted neutral kingdoms.",
                    "Demonstrates that moral leaders must wage peace with greater vigor than warmongers wage war."
                ]
            }
        ]
    },
    13: {
        "theme": "Yājñasenī: A Woman Born from Sacrificial Fire",
        "points": [
            {
                "section_title": "1. The Legal and Moral Cross-Examination in the Dyūta Sabhā",
                "points": [
                    "Draupadī challenges the Kuru elders with an unanswerable jurisprudence question: Did Yudhiṣṭhira lose himself first before staking her?",
                    "Her interrogation shatters the moral authority of Bhīṣma, Droṇa, and Dhṛtarāṣṭra, exposing legalistic hypocrisy in patriarchal power structures."
                ]
            }
        ]
    },
    14: {
        "theme": "Death and Deathlessness: Sanatsujātīya Teachings",
        "points": [
            {
                "section_title": "1. Overcoming the Illusion of Mortality",
                "points": [
                    "Sage Sanatsujāta teaches Dhṛtarāṣṭra that 'Pramāda' (heedlessness / spiritual negligence) is the true cause of death.",
                    "Physical death is a mere biological event; spiritual extinction occurs when one identifies completely with the ego and sensory attachments."
                ]
            }
        ]
    },
    15: {
        "theme": "The Goal of Life: Moksha and Svargarohana",
        "points": [
            {
                "section_title": "1. The Ascent and the Ultimate Dog Companion",
                "points": [
                    "As the Pāṇḍavas fall one by one on the Himālayas due to their subtle ego attachments, Yudhiṣṭhira refuses heaven unless his faithful dog (Dharma incarnate) can enter with him.",
                    "Supreme revelation: Compassion for the humblest living creature outweighs personal celestial reward.",
                    "The epic concludes where it began: an uncompromising celebration of selfless Dharma as the sole eternal truth."
                ]
            }
        ]
    }
}

def update_lessons():
    for ch_num, data in CHAPTER_POINTS.items():
        ch_str = f"{ch_num:02d}"
        paths = [
            f"frontend/src/data/lessons/ch{ch_str}.json",
            f"data/lessons/lesson_ch{ch_str}.json"
        ]
        
        # Build markdown text for in_depth_explanation
        md_lines = [f"### {data['theme']} — Point-by-Point Analysis\n"]
        for sec in data['points']:
            md_lines.append(f"#### {sec['section_title']}")
            for p in sec['points']:
                md_lines.append(f"- {p}")
            md_lines.append("")
        in_depth_md = "\n".join(md_lines)
        
        for p in paths:
            if os.path.exists(p):
                with open(p, 'r', encoding='utf-8') as f:
                    lesson = json.load(f)
                
                lesson['point_by_point_explanation'] = data['points']
                lesson['in_depth_explanation'] = in_depth_md
                
                with open(p, 'w', encoding='utf-8') as f:
                    json.dump(lesson, f, ensure_ascii=False, indent=2)
                print(f"Updated ch{ch_str} at {p}")

if __name__ == '__main__':
    update_lessons()
