import type { PetState } from './minigameSave'
import type { PalmonRarity } from './wildFamiliars'
import {
  affectionBuffMultiplier,
  companionAffinityMultiplier,
  effectiveSupportBuffs,
  maxSupportBuffSlots,
  type SupportStat,
} from './myrionMvp2'

export type CompanionMyrionLinks = Partial<Record<string, string>>

export function getLinkedMyrion(
  pets: PetState[],
  links: CompanionMyrionLinks,
  companionId: string,
): PetState | undefined {
  const petId = links[companionId]
  if (!petId) return undefined
  return pets.find((pet) => pet.id === petId)
}

export function findCompanionForMyrion(
  links: CompanionMyrionLinks,
  petId: string,
): string | undefined {
  return Object.entries(links).find(([, linkedPetId]) => linkedPetId === petId)?.[0]
}

export function linkMyrionToCompanion(
  links: CompanionMyrionLinks,
  pets: PetState[],
  companionId: string,
  petId: string,
): { links: CompanionMyrionLinks; error?: string } {
  const pet = pets.find((entry) => entry.id === petId)
  if (!pet) return { links, error: 'Myrion introuvable.' }
  if (pet.rarity === 'LR') {
    return { links, error: 'Les LR utilisent un bonus unique — pas de liaison standard.' }
  }
  if ((pet.supportBuffs ?? []).length === 0) {
    return { links, error: 'Ce Myrion n’a aucun buff de soutien à transmettre.' }
  }

  const next: CompanionMyrionLinks = { ...links }
  for (const [linkedCompanionId, linkedPetId] of Object.entries(next)) {
    if (linkedPetId === petId) delete next[linkedCompanionId]
  }
  next[companionId] = petId
  return { links: next }
}

export function unlinkCompanionMyrion(
  links: CompanionMyrionLinks,
  companionId: string,
): CompanionMyrionLinks {
  if (!links[companionId]) return links
  const next = { ...links }
  delete next[companionId]
  return next
}

export function removeCompanionLinksForPet(
  links: CompanionMyrionLinks,
  petId: string,
): CompanionMyrionLinks {
  const next = { ...links }
  for (const [companionId, linkedPetId] of Object.entries(next)) {
    if (linkedPetId === petId) delete next[companionId]
  }
  return next
}

export function describeInactiveBuffs(pet: PetState): string {
  const max = maxSupportBuffSlots(pet)
  const inactive = (pet.supportBuffs ?? []).slice(max)
  if (inactive.length === 0) return ''
  return inactive.map((buff) => `${buff.stat} +${buff.value} (inactif)`).join(' · ')
}

export function computeLinkedStatBonus(
  pet: PetState,
  companionId: string,
  stat: SupportStat,
): number {
  const buffs = effectiveSupportBuffs(pet).filter((buff) => buff.stat === stat)
  if (buffs.length === 0) return 0
  const affinity = companionAffinityMultiplier(companionId, pet)
  const affection = affectionBuffMultiplier(pet.affectionLevel)
  const lineage = 0.9 + (pet.lineagePotential ?? 50) / 200
  return buffs.reduce((sum, buff) => sum + buff.value * affinity * affection * lineage, 0)
}

export function linkedMyrionCaptureBonus(
  pets: PetState[],
  links: CompanionMyrionLinks,
  companionId: string,
): number {
  const pet = getLinkedMyrion(pets, links, companionId)
  if (!pet) return 0
  return computeLinkedStatBonus(pet, companionId, 'capture')
}

export function describeLinkedBuffs(pet: PetState, companionId: string): string {
  const buffs = effectiveSupportBuffs(pet)
  if (buffs.length === 0) return 'Aucun buff actif'
  const affinity = companionAffinityMultiplier(companionId, pet)
  return buffs
    .map((buff) => `${buff.stat} +${(buff.value * affinity).toFixed(1)}`)
    .join(' · ')
}

export function rarityLinkLabel(rarity: PalmonRarity): string {
  switch (rarity) {
    case 'N':
      return '1 slot'
    case 'R':
    case 'SR':
      return '2 slots'
    case 'SSR':
      return '2–3 slots'
    case 'UR':
      return '3 slots'
    case 'LR':
      return 'Bonus unique'
    default:
      return ''
  }
}
