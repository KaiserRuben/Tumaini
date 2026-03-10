<template>
  <div class="legal-page">
    <div class="legal-header">
      <Button icon="pi pi-arrow-left" severity="secondary" text @click="$router.push('/')" />
      <h1>Impressum</h1>
    </div>

    <h2>Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
    <p>Ruben Alexander Kaiser<br/>
      Willi-Graf-Str. 17<br/>
      Apt. 617<br/>
      80805 M&uuml;nchen</p>

    <h2>Kontakt</h2>
    <p>Telefon: 015156229689<br/>
      E-Mail: ruben@kaiser.fyi</p>

    <h3>Haftung f&uuml;r Inhalte</h3>
    <p>Als Diensteanbieter sind wir gem&auml;&szlig; &sect; 7 Abs.1 TMG f&uuml;r eigene Inhalte auf diesen Seiten nach
      den allgemeinen Gesetzen verantwortlich. Nach &sect;&sect; 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
      verpflichtet, &uuml;bermittelte oder gespeicherte fremde Informationen zu &uuml;berwachen oder nach Umst&auml;nden
      zu forschen, die auf eine rechtswidrige T&auml;tigkeit hinweisen.</p>
    <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben
      hiervon unber&uuml;hrt. Eine diesbez&uuml;gliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer
      konkreten Rechtsverletzung m&ouml;glich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
      Inhalte umgehend entfernen.</p>

    <h3>Haftung f&uuml;r Links</h3>
    <p>Unser Angebot enth&auml;lt Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
      Deshalb k&ouml;nnen wir f&uuml;r diese fremden Inhalte auch keine Gew&auml;hr &uuml;bernehmen. F&uuml;r die
      Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die
      verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf m&ouml;gliche Rechtsverst&ouml;&szlig;e &uuml;berpr&uuml;ft.
      Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.</p>
    <p>Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer
      Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend
      entfernen.</p>

    <h3>Urheberrecht</h3>
    <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
      Urheberrecht. Die Vervielf&auml;ltigung, Bearbeitung, Verbreitung und jede Art der Verwertung au&szlig;erhalb der
      Grenzen des Urheberrechtes bed&uuml;rfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
      Downloads und Kopien dieser Seite sind nur f&uuml;r den privaten, nicht kommerziellen Gebrauch gestattet.</p>
    <p>Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter
      beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
      Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
      Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>

    <p class="source-attribution">Quelle: <a href="https://www.e-recht24.de">e-recht24.de</a></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from 'primevue/button';

export default defineComponent({
  name: 'Legal',
  components: { Button },
});
</script>

<style scoped>
.legal-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  text-align: left;
}

.legal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.legal-header h1 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 1.75rem;
  font-weight: 400;
  margin: 0;
}

h2 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 400;
  margin: 1.5rem 0 0.5rem;
}

h3 {
  font-size: 1rem;
  margin: 1.25rem 0 0.35rem;
}

p {
  line-height: 1.6;
  color: var(--t-text-label);
  font-size: 0.9rem;
}

.source-attribution {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
}
</style>
