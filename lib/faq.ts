export interface FaqItem {
  question: string
  answer: string
}

export const FAQ: FaqItem[] = [
  {
    question: '¿Qué es DUPR?',
    answer:
      'El rating universal del pickleball. Va de 2.0 (recién empiezas) a 8.0 (te ganas la vida con esto). Se actualiza con cada partido reportado, sin importar si lo jugaste en un torneo o un domingo cualquiera. Si tu DUPR sube 0.05 después de una buena semana, es real.',
  },
  {
    question: '¿Qué es el PPA Tour?',
    answer:
      'El circuito profesional más importante del pickleball en Estados Unidos. Los mejores del mundo juegan aquí por puntos y premios. El ranking PPA refleja cuánto ganaste en torneos del año: más finales, más puntos. Si estás en el top 10, vives del pickleball.',
  },
]
