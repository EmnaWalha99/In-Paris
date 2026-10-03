from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    paris_api_base_url: str
    paris_api_dataset: str
    paris_api_timeout: float


settings = Settings()
