import json

chapter_chars = [
  [('Vyasa','Author of the epic, keeper of cosmic truth','Dharma'),('Krishna','Divine guide, embodiment of Dharma itself','Dharma'),('Ganesha','Scribe of the epic, remover of obstacles','Dharma')],
  [('Dhritarashtra','Blind king swayed by attachment to his son','Adharma'),('Duryodhana','Crown prince driven by envy and arrogance','Adharma'),('Shakuni','Devious schemer who engineers the downfall','Adharma')],
  [('Yudhishthira','Righteous king undone by dharmic confusion','Dharma'),('Draupadi','Victim of injustice; her question changes everything','Dharma'),('Shakuni','Engineer of the loaded dice and moral destruction','Adharma')],
  [('Pandavas','Brothers tempered by hardship into dharmic warriors','Dharma'),('Draupadi','Source of steadfast moral courage through exile','Dharma'),('Bhima','Hot-tempered but fiercely loyal protector','Dharma')],
  [('Krishna','Peace ambassador; chooses dharma over war repeatedly','Dharma'),('Arjuna','Supreme archer whose resolve will be tested','Dharma'),('Duryodhana','Chooses pride over peace, triggering the war','Adharma')],
  [('Arjuna','Warrior paralysed by grief — the student','Dharma'),('Krishna','The divine teacher; source of all Gita wisdom','Dharma'),('Sanjaya','Divine narrator who witnesses the battlefield','Neutral')],
  [('Arjuna','Transformed from grief to divine resolve','Dharma'),('Krishna','Reveals the eternal nature of the Self (Atman)','Dharma'),('Drona','Guru of both sides; bound by feudal duty','Neutral')],
  [('Arjuna','Witness to the terrifying Vishvarupa form','Dharma'),('Krishna','Reveals his Universal Form to Arjuna','Dharma'),('Sanjaya','Blessed with divine sight by Vyasa','Neutral')],
  [('Bhishma','Greatest warrior, loyal to throne over dharma','Neutral'),('Arjuna','Must overcome love for grandfather to do his duty','Dharma'),('Shikhandi','Becomes the instrument of Bhishma\'s fall','Dharma')],
  [('Drona','Brilliant teacher caught between duty and grief','Neutral'),('Yudhishthira','Forced to utter a half-lie — his first moral fall','Dharma'),('Abhimanyu','Young hero trapped in Chakravyuha and slain','Dharma')],
  [('Karna','Noble but tragic — loyal to the wrong side','Neutral'),('Kunti','Reveals a devastating secret too late','Dharma'),('Duryodhana','Exploits Karna\'s loyalty to sustain his ambitions','Adharma')],
  [('Ashvatthama','Commits the greatest war crime in the epic','Adharma'),('Pandavas','Survivors who must process irreversible loss','Dharma'),('Draupadi','Demands justice for her slain sons','Dharma')],
  [('Yudhishthira','Wins the war but drowns in survivor\'s guilt','Dharma'),('Gandhari','Curses Krishna — the most human response to loss','Neutral'),('Dhritarashtra','Finally confronts consequences of blind partiality','Neutral')],
  [('Yudhishthira','Only he reaches Heaven\'s gate; passes the final test','Dharma'),('Pandavas','Each falls during the final journey, ego by ego','Dharma'),('Draupadi','First to fall — her love was unequal, her flaw','Neutral')],
  [('Yudhishthira','Refuses heaven without his companions — ultimate dharma','Dharma'),('Pandavas','Reunited in the divine realm after all trials','Dharma'),('Dharma','The dog who walked beside — revealed as God himself','Dharma')],
]

for i in range(1, 16):
    path = f'frontend/src/data/lessons/ch{i:02d}.json'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    data['characters'] = [{'name': n, 'role': r, 'alignment': a} for n, r, a in chapter_chars[i-1]]
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print('Done: all 15 lesson files updated with correct alignments')
