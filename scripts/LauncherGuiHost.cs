using System;
using System.Drawing;
using System.IO;
using System.Reflection;
using System.Windows.Forms;
using Microsoft.Web.WebView2.WinForms;

[assembly: AssemblyTitle("IDLE Isekai Chill")]
[assembly: AssemblyProduct("IDLE Isekai Chill")]
[assembly: AssemblyDescription("Tableau de bord lanceur serveur stable")]

namespace IdleIsekaiChill.LauncherGui
{
    internal static class Program
    {
        [STAThread]
        private static void Main(string[] args)
        {
            if (args.Length < 1 || string.IsNullOrWhiteSpace(args[0]))
            {
                return;
            }

            var url = args[0].Trim();
            var iconPath = args.Length > 1 ? args[1].Trim() : null;

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            var form = new Form
            {
                Text = "IDLE Isekai Chill",
                Width = 1040,
                Height = 780,
                StartPosition = FormStartPosition.CenterScreen,
                MinimumSize = new Size(820, 620),
            };

            if (!string.IsNullOrEmpty(iconPath) && File.Exists(iconPath))
            {
                try
                {
                    if (iconPath.EndsWith(".png", StringComparison.OrdinalIgnoreCase))
                    {
                        using (var bitmap = new Bitmap(iconPath))
                        {
                            form.Icon = Icon.FromHandle(bitmap.GetHicon());
                        }
                    }
                    else
                    {
                        form.Icon = new Icon(iconPath);
                    }
                }
                catch
                {
                    /* icône optionnelle */
                }
            }

            var webView = new WebView2 { Dock = DockStyle.Fill };
            form.Controls.Add(webView);

            form.Shown += async (_, __) =>
            {
                try
                {
                    await webView.EnsureCoreWebView2Async(null);
                    if (webView.CoreWebView2 != null)
                    {
                        webView.CoreWebView2.Settings.AreDevToolsEnabled = false;
                        webView.CoreWebView2.Settings.IsStatusBarEnabled = false;
                    }
                    webView.Source = new Uri(url);
                }
                catch (Exception ex)
                {
                    MessageBox.Show(
                        form,
                        "WebView2 indisponible.\n\n" + ex.Message + "\n\nInstalle Microsoft Edge ou le runtime WebView2.",
                        "IDLE Isekai Chill",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Error);
                    form.Close();
                }
            };

            Application.Run(form);
        }
    }
}
