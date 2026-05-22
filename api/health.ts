export default function handler(_req: unknown, res: { status: (code: number) => { json: (body: { status: string }) => void } }) {
  res.status(200).json({ status: 'ok' });
}
