export default function generateTransitionId(): string {
  const timestamp = Date.now(); 
  const random = Math.floor(Math.random() * 10000); 
  return `trans_${timestamp}_${random}`;
}
