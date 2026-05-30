import { app } from "./app";

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((_err) => {
  process.exit(1);
});
