/** Hand-audited English answer variants for meaning grading.
 * Keys are reference gloss parts exactly as authored, after lowercase and
 * punctuation stripping (so "Chinese (language)" is keyed "chinese language").
 * Only genuine lexical equivalents belong here: matching a variant is
 * exact-match semantics over a human-approved list, never fuzzy tolerance.
 * Misspellings, inflections, and close-but-different words are never listed;
 * near-miss typing is handled separately and never earns credit.
 */
export const ANSWER_VARIANTS=Object.freeze({
 'hello':['hi'],
 'good':['fine','nice'],
 'to speak':['talk','to talk'],
 'say':['tell','to tell'],
 'to buy':['purchase','to purchase'],
 'to return':['return','to come back','come back','to go back','go back'],
 'chinese language':['chinese','mandarin'],
 'telephone':['phone'],
 'mobile phone':['cell phone','cellphone'],
 'airplane':['plane','aircraft'],
 'a little':['a bit','a little bit'],
 'big':['large'],
 'student':['pupil'],
 'money':['cash'],
 'thing':['item'],
 'to like':['enjoy','to enjoy']
});
