'use client';

import styles from '../styles/EquipementLayout.module.css';
import EquipementSlot from './EquipementSlot';

interface EquipementPanelProps {
  onEquipementChange: (slot: string, level: number) => void;
}

export default function EquipementPanel({ onEquipementChange }: EquipementPanelProps) {
  return (
    <div className={styles.panel}>
      <EquipementSlot slotId="helmet" slotName="Casque" onLevelChange={onEquipementChange} className={styles.helmet} />
      <EquipementSlot slotId="amulet" slotName="Amulette" onLevelChange={onEquipementChange} className={styles.amulet} />
      <EquipementSlot slotId="ring1" slotName="Anneau 1" onLevelChange={onEquipementChange} className={styles.ring1} />
      <EquipementSlot slotId="ring2" slotName="Anneau 2" onLevelChange={onEquipementChange} className={styles.ring2} />
      <EquipementSlot slotId="belt" slotName="Ceinture" onLevelChange={onEquipementChange} className={styles.belt} />
      <EquipementSlot slotId="boots" slotName="Bottes" onLevelChange={onEquipementChange} className={styles.boots} />
      <EquipementSlot slotId="cape" slotName="Cape" onLevelChange={onEquipementChange} className={styles.cape} />
      <EquipementSlot slotId="shield" slotName="Bouclier" onLevelChange={onEquipementChange} className={styles.shield} />
      <EquipementSlot slotId="weapon" slotName="Arme" onLevelChange={onEquipementChange} className={styles.weapon} />
    </div>
  );
}
