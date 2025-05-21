Feature: Criação e preparação de personagens
  Como um jogador de D&D
  Quero criar personagens e marcá-los como prontos
  Para que eu possa usá-los em aventuras futuras

  Scenario: Criar um novo personagem
    Given que estou na página de criação de personagens
    When eu preencho o nome "Minsc"
    And escolho a classe "Ranger"
    And clico no botão de criação de personagem
    Then vejo "Minsc (Ranger)" na lista de personagens

  Scenario: Marcar personagem como pronto
    Given que estou na página de criação de personagens
    And eu crio o personagem "Viconia" com a classe "Clériga"
    When eu marco "Viconia" como pronta
    Then vejo "Viconia" marcada como pronta
